import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { ChildForm } from "@/components/app/ChildForm";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { createChild } from "@/lib/children.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/children/new")({
  head: () => ({ meta: [{ title: "Tambah Profil Anak · Temu Anak" }] }),
  component: NewChildPage,
});

function NewChildPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const create = useServerFn(createChild);

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Profil Baru</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Tambah Profil Anak</h1>
        <p className="mt-2 max-w-xl text-base text-muted-foreground">
          Isi data anak lalu kami akan otomatis buatkan QR Daruratnya.
        </p>
      </div>

      <ChildForm
        submitLabel="Buat Profil"
        onSubmit={async (values) => {
          try {
            const res = await create({ data: values });
            await qc.invalidateQueries({ queryKey: ["children"] });
            toast.success("Profil anak dibuat");
            navigate({ to: "/children/$id", params: { id: (res as { id: string }).id } });
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Gagal membuat profil");
          }
        }}
      />
    </AppShell>
  );
}
