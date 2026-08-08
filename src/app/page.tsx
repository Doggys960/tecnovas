"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirige automáticamente al dashboard al cargar la página
    router.push("/dashboard") // Cambia "/dashboard" por tu ruta principal si es diferente
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-2xl p-10 w-full max-w-[400px] shadow-lg text-center">
        <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-5">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-[22px] font-extrabold mb-1">TecnoInnova S.A.</h1>
        <p className="text-[13px] text-gray-400 mb-7">Sistema de Gestión Integral de Seguridad Electrónica</p>
        
        <div className="py-6">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-gray-600">Cargando sistema...</p>
        </div>

        <p className="text-[11px] text-gray-400 mt-5">v2.4.1 — Servidor: PROD-01</p>
      </div>
    </div>
  )
}
