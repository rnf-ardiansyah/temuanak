import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export const toggleQr = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ qrId: z.string().uuid(), active: z.boolean() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("qr_codes")
      .update({ active: data.active })
      .eq("id", data.qrId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const regenerateQr = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ qrId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    // Generate new token via Postgres helper through a tiny rpc-less roundtrip:
    // simplest: call generate via raw select using rpc? We don't have it as rpc.
    // Just regenerate client-side using crypto + update.
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    const token = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    const { error } = await context.supabase
      .from("qr_codes")
      .update({ token, active: true, view_count: 0 })
      .eq("id", data.qrId);
    if (error) throw new Error(error.message);
    return { token };
  });

export const getPublicQr = createServerFn({ method: "GET" })
  .inputValidator((d: { token: string }) =>
    z.object({ token: z.string().min(8).max(64) }).parse(d),
  )
  .handler(async ({ data }) => {
    const supa = publicClient();
    const { data: rows, error } = await supa.rpc("get_public_qr", { _token: data.token });
    if (error) throw new Error(error.message);
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row) return null;
    let photoUrl: string | null = null;
    if (row.photo_url) {
      const { data: pub } = supa.storage.from("child-photos").getPublicUrl(row.photo_url);
      photoUrl = pub.publicUrl;
    }
    return { ...row, photo_url: photoUrl };
  });

export const recordQrView = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string; uaHash?: string }) =>
    z.object({ token: z.string().min(8).max(64), uaHash: z.string().max(64).optional() }).parse(d),
  )
  .handler(async ({ data }) => {
    const supa = publicClient();
    await supa.rpc("record_qr_view", { _token: data.token, _ua_hash: data.uaHash ?? "" });
    return { ok: true };
  });
