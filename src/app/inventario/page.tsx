"use client"
import { useEffect, useState } from "react"
import Sidebar from "@/components/Sidebar"

export default function InventarioPage() {
  const [productos, setProductos] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ id_producto: "", cantidad: "", id_proveedor: "" })

  useEffect(() => { fetchData() }, [])

  const fetchData = () => fetch("/api/inventario").then(r => r.json()).then(d => setProductos(d.data || []))

  const solicitar = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/inventario", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setModal(false)
    fetchData()
  }

  const totalStock = productos.reduce((a, p) => a + p.stock_actual, 0)
  const totalReservado = productos.reduce((a, p) => a + (p.reservado || 0), 0)
  const criticos = productos.filter(p => p.stock_actual <= p.stock_minimo).length

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-60 p-7 max-w-[calc(100vw-15rem)]">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h1 className="text-2xl font-extrabold">Control de Inventario</h1>
            <p className="text-[13px] text-gray-400">Stock, reservas y reposiciones</p>
          </div>
          <button onClick={() => setModal(true)} className="btn btn-primary">+ Solicitar Reposición</button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="card p-5"><div className="text-[22px] font-extrabold">{totalStock}</div><div className="text-xs text-gray-400 mt-1">Equipos en stock</div></div>
          <div className="card p-5"><div className="text-[22px] font-extrabold">{totalReservado}</div><div className="text-xs text-gray-400 mt-1">Reservados</div></div>
          <div className="card p-5"><div className="text-[22px] font-extrabold text-red-500">{criticos}</div><div className="text-xs text-gray-400 mt-1">Faltantes críticos</div></div>
        </div>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wider font-semibold"><th className="text-left px-4 py-3">Producto</th><th className="text-left px-4 py-3">Categoría</th><th className="text-left px-4 py-3">Stock</th><th className="text-left px-4 py-3">Mínimo</th><th className="text-left px-4 py-3">Estado</th></tr></thead>
            <tbody>
              {productos.map(p => {
                const critico = p.stock_actual <= p.stock_minimo
                return (
                  <tr key={p.id_producto} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3.5 text-xs font-bold">{p.nombre}</td>
                    <td className="px-4 py-3.5 text-gray-600">{p.categoria}</td>
                    <td className="px-4 py-3.5 text-gray-600">{p.stock_actual}</td>
                    <td className="px-4 py-3.5 text-gray-500">{p.stock_minimo}</td>
                    <td className="px-4 py-3.5"><span className={`badge ${critico ? "badge-rejected" : "badge-approved"}`}>{critico ? "Crítico" : "OK"}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50" onClick={() => setModal(false)}>
            <div className="bg-white rounded-xl p-7 w-[90%] max-w-[500px] shadow-lg" onClick={e => e.stopPropagation()}>
              <h3 className="text-base font-bold mb-5">Solicitud de Reposición</h3>
              <form onSubmit={solicitar}>
                <div className="mb-3"><label className="block text-xs font-semibold text-gray-600 mb-1.5">Producto</label><select className="input" value={form.id_producto} onChange={e => setForm({...form, id_producto: e.target.value})} required><option value="">Seleccione...</option>{productos.filter(p => p.stock_actual <= p.stock_minimo).map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>)}</select></div>
                <div className="mb-3"><label className="block text-xs font-semibold text-gray-600 mb-1.5">Cantidad</label><input type="number" className="input" value={form.cantidad} onChange={e => setForm({...form, cantidad: e.target.value})} required /></div>
                <div className="mb-5"><label className="block text-xs font-semibold text-gray-600 mb-1.5">Proveedor</label><select className="input" value={form.id_proveedor} onChange={e => setForm({...form, id_proveedor: e.target.value})} required><option value="">Seleccione...</option><option value="1">Distribuidora Seguridad S.A.</option><option value="2">Importadora TecnoAndina</option><option value="3">Hikvision Ecuador</option></select></div>
                <div className="flex gap-2.5 justify-end">
                  <button type="button" onClick={() => setModal(false)} className="btn btn-ghost">Cancelar</button>
                  <button type="submit" className="btn btn-primary">Enviar Solicitud</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
