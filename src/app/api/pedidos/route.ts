import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const estado = searchParams.get("estado")

  const where = estado ? { estado } : {}
  const pedidos = await prisma.pedido.findMany({
    where,
    include: { cliente: true, validaciones: true, ordenes: true },
    orderBy: { fecha_creacion: "desc" },
  })
  return NextResponse.json({ data: pedidos })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const codigo = `PED-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9999)).padStart(4,"0")}`

  const pedido = await prisma.pedido.create({
    data: {
      codigo,
      id_cliente: body.id_cliente,
      tipo_servicio: body.tipo_servicio,
      ubicacion: body.ubicacion,
      detalles: body.detalles,
      estado: "pendiente",
      id_vendedor: session.user.id,
    },
  })

  // Crear validaciones automáticas
  await prisma.validacionPedido.createMany({
    data: [
      { id_pedido: pedido.id_pedido, tipo_validacion: "tecnica" },
      { id_pedido: pedido.id_pedido, tipo_validacion: "financiera" },
    ],
  })

  return NextResponse.json({ message: "Pedido creado", data: pedido }, { status: 201 })
}
