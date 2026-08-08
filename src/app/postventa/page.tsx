"use client"
import { useEffect, useState } from "react"
import Sidebar from "@/components/Sidebar"

export default function PostventaPage() {
  const [seguimientos, setSeguimientos] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ id_pedido: "", satisfaccion: "5", observaciones: "", tipo_contacto: "llamada" })

  useEffect(() => { fetchData() }, [])

  const fetchData = () => fetch("/api/postventa").then(r => r.json()).then(d => setSeguimientos(d.data || []))

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/postventa", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, satisfaccion: parseInt(form.satisfaccion) }) })
    setModal(false)
    fetchData()
  }

  const stars = (n: number | null) => n ? "★".repeat(n) + "☆".repeat(5 - n) : "—"

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-60 p-7 max-w-[calc(100vw-15rem)]">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h1 className="text-2xl font-extrabold">Seguimiento Postventa</h1>
            <p className="text-[13px] text-gray-400">Satisfacción, reclamos y calidad</p>
          </div>
          <button onClick={() => setModal(true)} className="btn btn-primary">+ Registrar Seguimiento</button>
        </div>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wider font-semibold"><th className="text-left px-4 py-3">Cliente</th><th className="text-left px-4 py-3">Fecha Inst.</th><th className="text-left px-4 py-3">Contactado</th><th className="text-left px-4 py-3">Satisfacción</th><th className="text-left px-4 py-3">Observaciones</th><th className="text-left px-4 py-3">Estado</th></tr></thead>
            <tbody>
              {seguimientos.map(s => (
                <tr key={s.id_seguimiento} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3.5 text-xs font-bold">{s.pedido?.cliente?.razon_social}</td>
                  <td className="px-4 py-3.5 text-gray-600">{s.fecha_contacto ? new Date(s.fecha_contacto).toLocaleDateString("es-EC") : "—"}</td>
                  <td className="px-4 py-3.5 text-gray-600">{s.fecha_contacto ? "Sí" : "No"}</td>
                  <td className="px-4 py-3.5 text-amber-500 font-semibold">{stars(s.satisfaccion)}</td>
                  <td className="px-4 py-3.5 text-gray-600 max-w-xs truncate">{s.observaciones || "—"}</td>
                  <td className="px-4 py-3.5"><span className={`badge ${s.estado === "cerrado" ? "badge-completed" : "badge-pending"}`}>{s.estado === "cerrado" ? "Cerrado" : "Pendiente"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50" onClick={() => setModal(false)}>
            <div className="bg-white rounded-xl p-7 w-[90%] max-w-[500px] shadow-lg" onClick={e => e.stopPropagation()}>
              <h3 className="text-base font-bold mb-5">Registro de Seguimiento</h3>
              <form onSubmit={guardar}>
                <div className="mb-3"><label className="block text-xs font-semibold text-gray-600 mb-1.5">ID Pedido</label><input className="input" value={form.id_pedido} onChange={e => setForm({...form, id_pedido: e.target.value})} placeholder="Ej: 1" required /></div>
                <div className="mb-3"><label className="block text-xs font-semibold text-gray-600 mb-1.5">Satisfacción</label><select className="input" value={form.satisfaccion} onChange={e => setForm({...form, satisfaccion: e.target.value})}><option value="5">5 — Excelente</option><option value="4">4 — Bueno</option><option value="3">3 — Regular</option><option value="2">2 — Deficiente</option><option value="1">1 — Muy malo</option></select></div>
                <div className="mb-3"><label className="block text-xs font-semibold text-gray-600 mb-1.5">Tipo de Contacto</label><select className="input" value={form.tipo_contacto} onChange={e => setForm({...form, tipo_contacto: e.target.value})}><option value="llamada">Llamada telefónica</option><option value="visita">Visita presencial</option><option value="email">Correo electrónico</option><option value="whatsapp">WhatsApp</option></select></div>
                <div className="mb-5"><label className="block text-xs font-semibold text-gray-600 mb-1.5">Observaciones</label><textarea className="input" rows={3} value={form.observaciones} onChange={e => setForm({...form, observaciones: e.target.value})} /></div>
                <div className="flex gap-2.5 justify-end">
                  <button type="button" onClick={() => setModal(false)} className="btn btn-ghost">Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar Registro</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
