import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { normalizePhone, phoneRegex } from "@/lib/format";

const schema = z.object({
  nickname: z.string().trim().min(1, "Nama panggilan wajib").max(60),
  age: z
    .union([z.string(), z.number(), z.null()])
    .transform((v) => (v === "" || v === null || v === undefined ? null : Number(v)))
    .refine((v) => v === null || (!Number.isNaN(v) && v >= 0 && v <= 25), "Umur 0-25"),
  gender: z.enum(["L", "P", "Other"]).nullable().optional(),
  description: z.string().trim().max(500).nullable().optional().or(z.literal("")),
  photo_url: z.string().trim().max(500).nullable().optional(),
  emergency_contact: z
    .string()
    .trim()
    .min(7, "Wajib diisi")
    .refine((v) => phoneRegex.test(v.replace(/\s/g, "")), "Nomor tidak valid"),
  whatsapp: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((v) => !v || phoneRegex.test(v.replace(/\s/g, "")), "Nomor tidak valid"),
  notes: z.string().trim().max(500).nullable().optional().or(z.literal("")),
});

export type ChildFormValues = z.input<typeof schema>;
export type ChildFormOutput = z.output<typeof schema>;

export function ChildForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Partial<ChildFormValues>;
  submitLabel: string;
  onSubmit: (values: {
    nickname: string;
    age: number | null;
    gender: "L" | "P" | "Other" | null;
    description: string | null;
    photo_url: string | null;
    emergency_contact: string;
    whatsapp: string | null;
    notes: string | null;
  }) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChildFormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      nickname: initial?.nickname ?? "",
      age: initial?.age ?? null,
      gender: initial?.gender ?? null,
      description: initial?.description ?? "",
      photo_url: initial?.photo_url ?? null,
      emergency_contact: initial?.emergency_contact ?? "",
      whatsapp: initial?.whatsapp ?? "",
      notes: initial?.notes ?? "",
    },
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const photoUrl = watch("photo_url");

  useEffect(() => {
    if (!photoUrl) {
      setPreview(null);
      return;
    }
    let cancelled = false;
    supabase.storage
      .from("child-photos")
      .createSignedUrl(photoUrl, 60 * 60)
      .then(({ data }) => {
        if (!cancelled && data?.signedUrl) setPreview(data.signedUrl);
      });
    return () => {
      cancelled = true;
    };
  }, [photoUrl]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Format harus JPG, PNG, atau WEBP");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Maksimal 5 MB");
      return;
    }
    setUploading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Sesi tidak ditemukan");
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("child-photos").upload(path, file, {
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      setValue("photo_url", path, { shouldDirty: true });
      toast.success("Foto diunggah");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengunggah");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function clearPhoto() {
    setValue("photo_url", null, { shouldDirty: true });
  }

  return (
    <form
      onSubmit={handleSubmit(async (raw) => {
        const v = schema.parse(raw);
        await onSubmit({
          nickname: v.nickname,
          age: v.age,
          gender: (v.gender as "L" | "P" | "Other" | null) ?? null,
          description: (v.description as string | null) || null,
          photo_url: v.photo_url ?? null,
          emergency_contact: normalizePhone(v.emergency_contact),
          whatsapp: v.whatsapp ? normalizePhone(v.whatsapp) : null,
          notes: (v.notes as string | null) || null,
        });
      })}
      className="grid gap-6 rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-card)] md:p-8"
    >
      {/* Photo */}
      <div>
        <Label>Foto Anak</Label>
        <div className="mt-2 flex items-center gap-4">
          <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl border border-border bg-surface-soft">
            {preview ? (
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <Upload className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold disabled:opacity-60"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {photoUrl ? "Ganti Foto" : "Unggah Foto"}
            </button>
            {photoUrl && (
              <button
                type="button"
                onClick={clearPhoto}
                className="ml-2 inline-flex h-10 items-center gap-1 rounded-full border border-border bg-card px-3 text-sm font-semibold text-muted-foreground"
              >
                <X className="h-3.5 w-3.5" /> Hapus
              </button>
            )}
            <p className="mt-1.5 text-xs text-muted-foreground">JPG / PNG / WEBP, maks 5 MB.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Group>
          <Label>Nama Panggilan *</Label>
          <Input {...register("nickname")} placeholder="Ara" />
          <ErrorText>{errors.nickname?.message}</ErrorText>
        </Group>
        <Group>
          <Label>Umur</Label>
          <Input type="number" min={0} max={25} {...register("age")} placeholder="5" />
          <ErrorText>{errors.age?.message as string | undefined}</ErrorText>
        </Group>
        <Group>
          <Label>Jenis Kelamin</Label>
          <select
            {...register("gender")}
            className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-base outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
          >
            <option value="">—</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
            <option value="Other">Lainnya</option>
          </select>
        </Group>
        <Group>
          <Label>Nomor Darurat *</Label>
          <Input type="tel" {...register("emergency_contact")} placeholder="08123456789" />
          <ErrorText>{errors.emergency_contact?.message}</ErrorText>
        </Group>
        <Group>
          <Label>WhatsApp</Label>
          <Input type="tel" {...register("whatsapp")} placeholder="08123456789" />
          <ErrorText>{errors.whatsapp?.message as string | undefined}</ErrorText>
        </Group>
      </div>

      <Group>
        <Label>Ciri-ciri</Label>
        <Textarea
          rows={3}
          {...register("description")}
          placeholder="Rambut keriting, kaos kuning, sepatu merah."
        />
        <ErrorText>{errors.description?.message as string | undefined}</ErrorText>
      </Group>

      <Group>
        <Label>Catatan</Label>
        <Textarea rows={3} {...register("notes")} placeholder="Alergi, kondisi khusus, dll." />
      </Group>

      <button
        type="submit"
        disabled={isSubmitting || uploading}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-primary-glow)] disabled:opacity-60"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitLabel}
      </button>
    </form>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-1.5">{children}</div>;
}
function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</label>;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
    />
  );
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
    />
  );
}
function ErrorText({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="text-xs font-medium text-danger">{children}</p>;
}
