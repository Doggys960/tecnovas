import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const seguimientos = await prisma.seguimientoPostventa.findMany({
    include: { pedido: { include: { cliente: true } } },
    orderBy: { fecha_contacto: "desc" },
  })
  return NextResponse.json({ data: seguimientos })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const seguimiento = await prisma.seguimientoPostventa.create({
    data: {
      id_pedido: body.id_pedido,
      fecha_contacto: new Date(),
      satisfaccion: body.satisfaccion,
      observaciones: body.observaciones,
      tipo_contacto: body.tipo_contacto || "llamada",
      estado: "cerrado",
      id_agente: session.user.id,
    },
  })
  return NextResponse.json({ message: "Seguimiento registrado", data: seguimiento }, { status: 201 })
}
