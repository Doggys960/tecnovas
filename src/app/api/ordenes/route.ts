import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const ordenes = await prisma.ordenInstalacion.findMany({
    include: { pedido: { include: { cliente: true } }, tecnico: true },
    orderBy: { fecha_programada: "desc" },
  })
  return NextResponse.json({ data: ordenes })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const codigo = `ORD-${String(Math.floor(Math.random()*9999)).padStart(4,"0")}-01`

  const orden = await prisma.ordenInstalacion.create({
    data: {
      codigo,
      id_pedido: body.id_pedido,
      id_tecnico: body.id_tecnico,
      fecha_programada: new Date(body.fecha_programada),
      estado: "programada",
    },
  })

  await prisma.tecnico.update({
    where: { id_tecnico: body.id_tecnico },
    data: { carga_trabajo: { increment: 1 } },
  })

  await prisma.pedido.update({
    where: { id_pedido: body.id_pedido },
    data: { estado: "instalacion" },
  })

  return NextResponse.json({ message: "Orden creada", data: orden }, { status: 201 })
}
