import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { ChildForm } from "@/components/app/ChildForm";
import { getChild, updateChild } from "@/lib/children.functions";

const childQuery = (id: string, fn: (args: { data: { id: string } }) => Promise<unknown>) =>
  queryOptions({ queryKey: ["child", id], queryFn: () => fn({ data: { id } }) });

export const Route = createFileRoute("/_authenticated/children/$id/edit")({
  head: () => ({ meta: [{ title: "Edit Profil · TemuAnak" }] }),
  component: EditChildPage,
});

function EditChildPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const get = useServerFn(getChild);
  const update = useServerFn(updateChild);
  const { data } = useSuspenseQuery(childQuery(id, get));
  const child = data as Awaited<ReturnType<typeof getChild>>;

  return (
    <AppShell>
      <Link to="/children/$id" params={{ id }} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>
      <div className="mt-6 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Edit Profil</h1>
      </div>

      <ChildForm
        submitLabel="Simpan Perubahan"
        initial={{
          nickname: child.nickname,
          age: child.age,
          gender: (child.gender as "L" | "P" | "Other" | null) ?? null,
          description: child.description,
          photo_url: child.photo_url,
          emergency_contact: child.emergency_contact,
          whatsapp: child.whatsapp,
          notes: child.notes,
        }}
        onSubmit={async (values) => {
          try {
            await update({ data: { id, patch: values } });
            await qc.invalidateQueries({ queryKey: ["child", id] });
            await qc.invalidateQueries({ queryKey: ["children"] });
            toast.success("Profil diperbarui");
            navigate({ to: "/children/$id", params: { id } });
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
          }
        }}
      />
    </AppShell>
  );
}
