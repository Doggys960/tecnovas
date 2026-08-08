"use client"
import { useEffect, useState } from "react"
import Sidebar from "@/components/Sidebar"

export default function FacturacionPage() {
  const [facturas, setFacturas] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ id_orden: "", monto: "" })

  useEffect(() => { fetchData() }, [])

  const fetchData = () => fetch("/api/facturas").then(r => r.json()).then(d => setFacturas(d.data || []))

  const emitir = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/facturas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setModal(false)
    fetchData()
  }

  const estadoBadge = (estado: string) => {
    const map: Record<string, string> = { pendiente: "badge-pending", enviada: "badge-approved", pagada: "badge-completed", vencida: "badge-rejected" }
    const labels: Record<string, string> = { pendiente: "Pendiente", enviada: "Enviada", pagada: "Pagada", vencida: "Vencida" }
    return <span className={`badge ${map[estado] || "badge-pending"}`}>{labels[estado] || estado}</span>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-60 p-7 max-w-[calc(100vw-15rem)]">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h1 className="text-2xl font-extrabold">Facturación</h1>
            <p className="text-[13px] text-gray-400">Emisión, envío y registro contable</p>
          </div>
          <button onClick={() => setModal(true)} className="btn btn-primary">+ Nueva Factura</button>
        </div>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wider font-semibold"><th className="text-left px-4 py-3">N° Factura</th><th className="text-left px-4 py-3">Cliente</th><th className="text-left px-4 py-3">Monto</th><th className="text-left px-4 py-3">Estado</th><th className="text-left px-4 py-3">Fecha Emisión</th></tr></thead>
            <tbody>
              {facturas.map(f => (
                <tr key={f.id_factura} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3.5 text-xs font-bold">{f.codigo}</td>
                  <td className="px-4 py-3.5 text-gray-600">{f.orden?.pedido?.cliente?.razon_social}</td>
                  <td className="px-4 py-3.5 font-semibold tabular-nums">${Number(f.total).toLocaleString()}</td>
                  <td className="px-4 py-3.5">{estadoBadge(f.estado)}</td>
                  <td className="px-4 py-3.5 text-gray-500">{new Date(f.fecha_emision).toLocaleDateString("es-EC")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50" onClick={() => setModal(false)}>
            <div className="bg-white rounded-xl p-7 w-[90%] max-w-[500px] shadow-lg" onClick={e => e.stopPropagation()}>
              <h3 className="text-base font-bold mb-5">Nueva Factura</h3>
              <form onSubmit={emitir}>
                <div className="mb-3"><label className="block text-xs font-semibold text-gray-600 mb-1.5">ID Orden Completada</label><input className="input" value={form.id_orden} onChange={e => setForm({...form, id_orden: e.target.value})} placeholder="Ej: 4" required /></div>
                <div className="mb-5"><label className="block text-xs font-semibold text-gray-600 mb-1.5">Monto (USD)</label><input type="number" step="0.01" className="input" value={form.monto} onChange={e => setForm({...form, monto: e.target.value})} required /></div>
                <div className="flex gap-2.5 justify-end">
                  <button type="button" onClick={() => setModal(false)} className="btn btn-ghost">Cancelar</button>
                  <button type="submit" className="btn btn-primary">Emitir Factura</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
