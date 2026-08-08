import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const facturas = await prisma.factura.findMany({
    include: { orden: { include: { pedido: { include: { cliente: true } } } } },
    orderBy: { fecha_emision: "desc" },
  })
  return NextResponse.json({ data: facturas })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const codigo = `FAC-001-${String(Math.floor(Math.random()*9999)).padStart(4,"0")}`
  const monto = parseFloat(body.monto)
  const iva = monto * 0.12
  const total = monto + iva

  const factura = await prisma.factura.create({
    data: {
      codigo,
      id_orden: body.id_orden,
      monto,
      iva,
      total,
      estado: "pendiente",
      fecha_vencimiento: new Date(Date.now() + 30*24*60*60*1000),
    },
  })

  await prisma.registroContable.create({
    data: {
      id_factura: factura.id_factura,
      tipo_movimiento: "ingreso",
      monto: total,
      descripcion: "Factura emitida",
    },
  })

  return NextResponse.json({ message: "Factura emitida", data: factura }, { status: 201 })
}
