import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)

  const [pedidos, instalaciones, facturado, satisfaccion] = await Promise.all([
    prisma.pedido.count({ where: { fecha_creacion: { gte: firstDay } } }),
    prisma.ordenInstalacion.count({ where: { estado: "completada", fecha_real_fin: { gte: firstDay } } }),
    prisma.factura.aggregate({ where: { estado: "pagada", fecha_emision: { gte: firstDay } }, _sum: { total: true } }),
    prisma.seguimientoPostventa.aggregate({ where: { satisfaccion: { not: null } }, _avg: { satisfaccion: true } }),
  ])

  return NextResponse.json({
    data: {
      pedidos_mes: pedidos,
      instalaciones,
      facturado: facturado._sum.total || 0,
      satisfaccion: Math.round((satisfaccion._avg.satisfaccion || 0) * 10) / 10,
    },
  })
}
