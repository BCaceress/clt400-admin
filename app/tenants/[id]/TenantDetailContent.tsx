"use client";

import Link from "next/link";
import { useState } from "react";
import { Edit } from "lucide-react";
import type { Tenant } from "@/lib/schema";
import AuthenticateSecretsModal from "./AuthenticateSecretsModal";

interface Props {
  tenant: Tenant;
}

export default function TenantDetailContent({ tenant }: Props) {
  const [showSecretsModal, setShowSecretsModal] = useState(false);

  return (
    <>
      <header className="bg-white border border-slate-200 p-5 rounded-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-baseline gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">{tenant.name}</h1>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  tenant.active
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tenant.active ? "Ativo" : "Inativo"}
              </span>
            </div>
            <p className="text-sm text-slate-600 font-mono break-all">
              https://clt400tt2.coletsistemas.com.br/{tenant.slug}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSecretsModal(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6z"/>
                <path fillRule="evenodd" d="M8 7V5a3 3 0 016 0v2h2a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2h2zm3-2v2h2V5a1 1 0 10-2 0z" clipRule="evenodd"/>
              </svg>
              Ver Secrets
            </button>
            <Link href={`/tenants/${tenant.id}/edit`} className="btn-secondary">
              <Edit className="w-4 h-4" />
              Editar
            </Link>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white border border-slate-200 p-5 rounded-lg">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">
            API Local
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-slate-500 font-medium">Protocolo</dt>
              <dd className="text-sm text-slate-700 font-mono mt-0.5">
                {tenant.apiProtocol}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 font-medium">Host</dt>
              <dd className="text-sm text-slate-700 font-mono mt-0.5">
                {tenant.apiHost}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 font-medium">Porta</dt>
              <dd className="text-sm text-slate-700 font-mono mt-0.5">
                {tenant.apiPort}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 font-medium">URL</dt>
              <dd className="text-xs text-slate-700 font-mono mt-0.5 break-all">
                {tenant.apiProtocol}://{tenant.apiHost}:{tenant.apiPort}
              </dd>
            </div>
          </dl>
        </section>

        <section className="bg-white border border-slate-200 p-5 rounded-lg">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">
            Informações
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-slate-500 font-medium">Criado em</dt>
              <dd className="text-sm text-slate-700 mt-0.5">
                {new Date(tenant.createdAt).toLocaleString("pt-BR")}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 font-medium">Setup</dt>
              <dd className="text-sm text-slate-700 mt-0.5">
                {tenant.setupCompletedAt
                  ? new Date(tenant.setupCompletedAt).toLocaleString("pt-BR")
                  : "Pendente"}
              </dd>
            </div>
            {tenant.setupCodeRotatedAt && (
              <div>
                <dt className="text-xs text-slate-500 font-medium">Última rotação</dt>
                <dd className="text-sm text-slate-700 mt-0.5">
                  {new Date(tenant.setupCodeRotatedAt).toLocaleString(
                    "pt-BR"
                  )}
                </dd>
              </div>
            )}
          </dl>
        </section>
      </div>

      {showSecretsModal && (
        <AuthenticateSecretsModal
          tenantId={tenant.id}
          onClose={() => setShowSecretsModal(false)}
        />
      )}
    </>
  );
}
