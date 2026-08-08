import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const productos = await prisma.producto.findMany({
    include: { proveedor: true },
    orderBy: [{ categoria: "asc" }, { nombre: "asc" }],
  })
  return NextResponse.json({ data: productos })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  await prisma.solicitudReposicion.create({
    data: {
      id_producto: body.id_producto,
      cantidad: body.cantidad,
      id_proveedor: body.id_proveedor,
      estado: "pendiente",
    },
  })
  return NextResponse.json({ message: "Reposición solicitada" }, { status: 201 })
}
