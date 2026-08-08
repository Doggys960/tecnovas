import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const tecnicos = await prisma.tecnico.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } })
  return NextResponse.json({ data: tecnicos })
}
