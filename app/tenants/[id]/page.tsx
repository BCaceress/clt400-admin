import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit } from "lucide-react";
import { getTenantById } from "@/lib/tenants";
import TenantActions from "./TenantActions";
import TenantDetailContent from "./TenantDetailContent";

export const dynamic = "force-dynamic";

export default async function TenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tenant = await getTenantById(id);
  if (!tenant) notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
        <Link
          href="/tenants"
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <TenantDetailContent tenant={tenant} />
        <TenantActions tenantId={tenant.id} active={tenant.active} />
      </div>
    </main>
  );
}
