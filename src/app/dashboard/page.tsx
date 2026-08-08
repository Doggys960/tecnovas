"use client"
import { useEffect, useState } from "react"
import Sidebar from "@/components/Sidebar"

interface Stats {
  pedidos_mes: number
  instalaciones: number
  facturado: number
  satisfaccion: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [pipeline, setPipeline] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/dashboard/stats").then(r => r.json()).then(d => setStats(d.data))
    fetch("/api/pedidos").then(r => r.json()).then(d => {
      setPipeline(d.data?.slice(0, 5) || [])
    })
  }, [])

  const alertas = [
    { tipo: "warning", msg: "3 productos con stock crítico detectados" },
    { tipo: "info", msg: "Pedido PED-2026-0840 espera validación técnica" },
    { tipo: "success", msg: "Orden ORD-0837-01 completada — listo para facturar" },
    { tipo: "danger", msg: "Factura FAC-001-0834 vencida — contactar cliente" },
  ]

  const steps = ["Recepción", "Validación Técnica", "Validación Financiera", "Aprobación", "Instalación"]

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-60 p-7 max-w-[calc(100vw-15rem)]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-extrabold">Panel de Control</h1>
            <p className="text-[13px] text-gray-400">Resumen operativo en tiempo real</p>
          </div>
          <div className="text-[13px] text-gray-400">Hoy: {new Date().toLocaleDateString("es-EC", { day:"numeric", month:"short", year:"numeric" })}</div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="card p-5">
            <div className="text-[28px] font-extrabold tabular-nums">{stats?.pedidos_mes ?? "—"}</div>
            <div className="text-xs text-gray-400 mt-1">Pedidos este mes</div>
            <div className="text-[11px] text-green-600 font-semibold mt-2">↑ 12% vs mes anterior</div>
          </div>
          <div className="card p-5">
            <div className="text-[28px] font-extrabold tabular-nums">{stats?.instalaciones ?? "—"}</div>
            <div className="text-xs text-gray-400 mt-1">Instalaciones completadas</div>
            <div className="text-[11px] text-green-600 font-semibold mt-2">↑ 8% vs mes anterior</div>
          </div>
          <div className="card p-5">
            <div className="text-[28px] font-extrabold tabular-nums">${stats?.facturado?.toLocaleString() ?? "—"}</div>
            <div className="text-xs text-gray-400 mt-1">Facturado (USD)</div>
            <div className="text-[11px] text-green-600 font-semibold mt-2">↑ 22% vs mes anterior</div>
          </div>
          <div className="card p-5">
            <div className="text-[28px] font-extrabold tabular-nums">{stats?.satisfaccion ?? "—"}</div>
            <div className="text-xs text-gray-400 mt-1">Satisfacción cliente</div>
            <div className="text-[11px] text-gray-400 font-semibold mt-2">Basado en encuestas</div>
          </div>
        </div>

        <div className="grid grid-cols-[2fr_1fr] gap-4">
          <div className="card p-5">
            <h3 className="text-sm font-bold mb-4">Flujo de Pedidos — Últimos 7 días</h3>
            {pipeline.map((p: any) => (
              <div key={p.id_pedido} className="border border-gray-200 rounded-lg p-3.5 mb-2.5">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-bold">{p.codigo}</span>
                  <span className={`badge badge-${p.estado === "pendiente" ? "pending" : p.estado === "aprobado" ? "approved" : p.estado === "rechazado" ? "rejected" : p.estado === "instalacion" ? "inprogress" : "completed"}`}>
                    {p.estado === "instalacion" ? "En Instalación" : p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {steps.map((s, i) => {
                    const done = p.validaciones?.filter((v: any) => v.aprobado === true).length >= i
                    const current = i === (p.validaciones?.filter((v: any) => v.aprobado === true).length || 0)
                    return <div key={s} className={`w-2.5 h-2.5 rounded-full ${done ? "bg-green-500" : current ? "bg-accent shadow-[0_0_0_3px_rgba(15,52,96,0.15)]" : "bg-gray-200"}`} title={s} />
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-bold mb-4">Alertas del Sistema</h3>
            {alertas.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg mb-2" style={{ background: `${a.tipo === "warning" ? "#f39c12" : a.tipo === "danger" ? "#e94560" : a.tipo === "success" ? "#2ecc71" : "#3498db"}10` }}>
                <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: a.tipo === "warning" ? "#f39c12" : a.tipo === "danger" ? "#e94560" : a.tipo === "success" ? "#2ecc71" : "#3498db" }} />
                <span className="text-xs text-gray-600 leading-relaxed">{a.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
