"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw, Trash2, Power } from "lucide-react";
import CopySecretModal from "@/components/CopySecretModal";
import ConfirmationModal from "@/components/ConfirmationModal";

interface Props {
  tenantId: string;
  active: boolean;
}

export default function TenantActions({ tenantId, active }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [rotated, setRotated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmRotate, setConfirmRotate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function rotate() {
    setBusy("rotate");
    setError(null);
    setConfirmRotate(false);
    try {
      const res = await fetch(
        `/api/tenants/${tenantId}/rotate-setup-code`,
        { method: "POST" },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Falha ao resetar.");
        return;
      }
      setRotated(data.setupCode);
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function toggleActive() {
    setBusy("toggle");
    setError(null);
    try {
      const res = await fetch(`/api/tenants/${tenantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Falha.");
        return;
      }
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    setBusy("delete");
    setError(null);
    setConfirmDelete(false);
    try {
      const res = await fetch(`/api/tenants/${tenantId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Falha.");
        return;
      }
      router.push("/tenants");
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="bg-white border border-slate-200 p-5 rounded-lg">
      <h2 className="text-sm font-semibold text-slate-900 mb-4">Ações</h2>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setConfirmRotate(true)}
          disabled={busy !== null}
          className="btn-secondary"
        >
          {busy === "rotate" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Resetar setup_code
        </button>

        <button
          type="button"
          onClick={toggleActive}
          disabled={busy !== null}
          className="btn-secondary"
        >
          <Power className="w-4 h-4" />
          {active ? "Desativar" : "Reativar"}
        </button>

        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          disabled={busy !== null}
          className="btn-danger"
        >
          <Trash2 className="w-4 h-4" />
          Excluir
        </button>
      </div>

      {rotated && (
        <CopySecretModal
          title="Setup code resetado"
          warning="Copie o novo setup_code agora. Ele NÃO será exibido novamente. Sessões ativas foram invalidadas — distribua o novo código apenas aos técnicos autorizados."
          secrets={[{ label: "Novo setup_code", value: rotated }]}
          onClose={() => setRotated(null)}
        />
      )}

      {confirmRotate && (
        <ConfirmationModal
          title="Resetar setup_code"
          message="Esta ação invalidará todas as sessões ativas. Técnicos precisarão do novo código para se conectar. Tem certeza?"
          onConfirm={rotate}
          onCancel={() => setConfirmRotate(false)}
          confirmText="Resetar"
          isLoading={busy === "rotate"}
        />
      )}

      {confirmDelete && (
        <ConfirmationModal
          title="Excluir tenant"
          message="Esta ação não pode ser desfeita. Todos os dados relacionados serão permanentemente removidos. Tem certeza?"
          danger
          onConfirm={remove}
          onCancel={() => setConfirmDelete(false)}
          confirmText="Excluir"
          isLoading={busy === "delete"}
        />
      )}
    </section>
  );
}
