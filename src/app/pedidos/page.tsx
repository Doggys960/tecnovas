"use client"
import { useEffect, useState } from "react"
import Sidebar from "@/components/Sidebar"

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ id_cliente: "", tipo_servicio: "", ubicacion: "", detalles: "" })

  useEffect(() => { fetchPedidos() }, [])

  const fetchPedidos = () => fetch("/api/pedidos").then(r => r.json()).then(d => setPedidos(d.data || []))

  const crearPedido = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/pedidos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setModal(false)
    fetchPedidos()
  }

  const estadoBadge = (estado: string) => {
    const map: Record<string, string> = { pendiente: "badge-pending", aprobado: "badge-approved", rechazado: "badge-rejected", instalacion: "badge-inprogress", completado: "badge-completed" }
    const labels: Record<string, string> = { pendiente: "Pendiente", aprobado: "Aprobado", rechazado: "Rechazado", instalacion: "En Instalación", completado: "Completado" }
    return <span className={`badge ${map[estado] || "badge-pending"}`}>{labels[estado] || estado}</span>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-60 p-7 max-w-[calc(100vw-15rem)]">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h1 className="text-2xl font-extrabold">Gestión de Pedidos</h1>
            <p className="text-[13px] text-gray-400">Recepción, validación y aprobación de órdenes</p>
          </div>
          <button onClick={() => setModal(true)} className="btn btn-primary">+ Nuevo Pedido</button>
        </div>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wider font-semibold"><th className="text-left px-4 py-3">ID</th><th className="text-left px-4 py-3">Cliente</th><th className="text-left px-4 py-3">Servicio</th><th className="text-left px-4 py-3">Ubicación</th><th className="text-left px-4 py-3">Estado</th><th className="text-left px-4 py-3">Fecha</th></tr></thead>
            <tbody>
              {pedidos.map(p => (
                <tr key={p.id_pedido} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 text-xs font-bold">{p.codigo}</td>
                  <td className="px-4 py-3.5 text-gray-600">{p.cliente?.razon_social}</td>
                  <td className="px-4 py-3.5 text-gray-600">{p.tipo_servicio}</td>
                  <td className="px-4 py-3.5 text-gray-600">{p.ubicacion}</td>
                  <td className="px-4 py-3.5">{estadoBadge(p.estado)}</td>
                  <td className="px-4 py-3.5 text-gray-500">{new Date(p.fecha_creacion).toLocaleDateString("es-EC")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50" onClick={() => setModal(false)}>
            <div className="bg-white rounded-xl p-7 w-[90%] max-w-[500px] shadow-lg" onClick={e => e.stopPropagation()}>
              <h3 className="text-base font-bold mb-5">Nuevo Pedido</h3>
              <form onSubmit={crearPedido}>
                <div className="mb-3"><label className="block text-xs font-semibold text-gray-600 mb-1.5">ID Cliente</label><input className="input" value={form.id_cliente} onChange={e => setForm({...form, id_cliente: e.target.value})} placeholder="1" required /></div>
                <div className="mb-3"><label className="block text-xs font-semibold text-gray-600 mb-1.5">Servicio</label><select className="input" value={form.tipo_servicio} onChange={e => setForm({...form, tipo_servicio: e.target.value})} required><option value="">Seleccione...</option><option>Cámaras IP</option><option>Alarmas</option><option>Control de Acceso</option><option>Videovigilancia completa</option></select></div>
                <div className="mb-3"><label className="block text-xs font-semibold text-gray-600 mb-1.5">Ubicación</label><input className="input" value={form.ubicacion} onChange={e => setForm({...form, ubicacion: e.target.value})} placeholder="Ciudad, Provincia" required /></div>
                <div className="mb-5"><label className="block text-xs font-semibold text-gray-600 mb-1.5">Detalles</label><textarea className="input" rows={3} value={form.detalles} onChange={e => setForm({...form, detalles: e.target.value})} /></div>
                <div className="flex gap-2.5 justify-end">
                  <button type="button" onClick={() => setModal(false)} className="btn btn-ghost">Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar Pedido</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
