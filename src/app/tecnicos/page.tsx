"use client"
import { useEffect, useState } from "react"
import Sidebar from "@/components/Sidebar"

export default function TecnicosPage() {
  const [tecnicos, setTecnicos] = useState<any[]>([])
  const [ordenes, setOrdenes] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ id_pedido: "", id_tecnico: "", fecha_programada: "" })

  useEffect(() => {
    fetch("/api/tecnicos").then(r => r.json()).then(d => setTecnicos(d.data || []))
    fetch("/api/ordenes").then(r => r.json()).then(d => setOrdenes(d.data || []))
  }, [])

  const crearOrden = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/ordenes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setModal(false)
    fetch("/api/ordenes").then(r => r.json()).then(d => setOrdenes(d.data || []))
    fetch("/api/tecnicos").then(r => r.json()).then(d => setTecnicos(d.data || []))
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-60 p-7 max-w-[calc(100vw-15rem)]">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h1 className="text-2xl font-extrabold">Asignación de Técnicos</h1>
            <p className="text-[13px] text-gray-400">Órdenes de instalación y cronograma</p>
          </div>
          <button onClick={() => setModal(true)} className="btn btn-primary">+ Nueva Orden</button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="card p-5">
            <h3 className="text-sm font-bold mb-3">Técnicos Disponibles</h3>
            {tecnicos.map(t => (
              <div key={t.id_tecnico} className="flex justify-between items-center p-3 rounded-lg border border-gray-200 mb-2">
                <div><div className="text-[13px] font-semibold">{t.nombre}</div><div className="text-[11px] text-gray-400">{t.zona_asignada}</div></div>
                <span className={`badge ${t.disponible ? "badge-approved" : "badge-pending"}`}>{t.disponible ? "Disponible" : "Ocupado"}</span>
              </div>
            ))}
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-bold mb-3">Carga de Trabajo</h3>
            {tecnicos.map(t => (
              <div key={t.id_tecnico} className="mb-3.5">
                <div className="flex justify-between mb-1"><span className="text-xs font-medium">{t.nombre}</span><span className="text-[11px] text-gray-400">{t.carga_trabajo} órdenes</span></div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${Math.min(t.carga_trabajo * 20, 100)}%`, background: t.carga_trabajo >= 5 ? "#e94560" : t.carga_trabajo >= 3 ? "#f39c12" : "#2ecc71" }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wider font-semibold"><th className="text-left px-4 py-3">Orden</th><th className="text-left px-4 py-3">Cliente</th><th className="text-left px-4 py-3">Técnico</th><th className="text-left px-4 py-3">Fecha</th><th className="text-left px-4 py-3">Estado</th></tr></thead>
            <tbody>
              {ordenes.map(o => (
                <tr key={o.id_orden} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3.5 text-xs font-bold">{o.codigo}</td>
                  <td className="px-4 py-3.5 text-gray-600">{o.pedido?.cliente?.razon_social}</td>
                  <td className="px-4 py-3.5 text-gray-600">{o.tecnico?.nombre}</td>
                  <td className="px-4 py-3.5 text-gray-500">{new Date(o.fecha_programada).toLocaleDateString("es-EC")}</td>
                  <td className="px-4 py-3.5"><span className={`badge ${o.estado === "programada" ? "badge-pending" : o.estado === "en_progreso" ? "badge-inprogress" : "badge-completed"}`}>{o.estado === "en_progreso" ? "En Progreso" : o.estado.charAt(0).toUpperCase() + o.estado.slice(1)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50" onClick={() => setModal(false)}>
            <div className="bg-white rounded-xl p-7 w-[90%] max-w-[500px] shadow-lg" onClick={e => e.stopPropagation()}>
              <h3 className="text-base font-bold mb-5">Nueva Orden de Instalación</h3>
              <form onSubmit={crearOrden}>
                <div className="mb-3"><label className="block text-xs font-semibold text-gray-600 mb-1.5">ID Pedido</label><input className="input" value={form.id_pedido} onChange={e => setForm({...form, id_pedido: e.target.value})} placeholder="Ej: 1" required /></div>
                <div className="mb-3"><label className="block text-xs font-semibold text-gray-600 mb-1.5">Técnico</label><select className="input" value={form.id_tecnico} onChange={e => setForm({...form, id_tecnico: e.target.value})} required><option value="">Seleccione...</option>{tecnicos.filter(t => t.disponible).map(t => <option key={t.id_tecnico} value={t.id_tecnico}>{t.nombre} — {t.zona_asignada}</option>)}</select></div>
                <div className="mb-5"><label className="block text-xs font-semibold text-gray-600 mb-1.5">Fecha Programada</label><input type="date" className="input" value={form.fecha_programada} onChange={e => setForm({...form, fecha_programada: e.target.value})} required /></div>
                <div className="flex gap-2.5 justify-end">
                  <button type="button" onClick={() => setModal(false)} className="btn btn-ghost">Cancelar</button>
                  <button type="submit" className="btn btn-primary">Generar Orden</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
