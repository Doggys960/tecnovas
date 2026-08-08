"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("admin@tecnoinnova.ec")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)
  
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-2xl p-10 w-full max-w-[400px] shadow-lg text-center">
        <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-5">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-[22px] font-extrabold mb-1">TecnoInnova S.A.</h1>
        <p className="text-[13px] text-gray-400 mb-7">Sistema de Gestión Integral de Seguridad Electrónica</p>
        {error && <div className="mb-4 text-sm text-red-500 bg-red-50 rounded-lg py-2">{error}</div>}
        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Usuario</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
          </div>
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" required />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Verificando..." : "Ingresar al Sistema"}
          </button>
        </form>
        <p className="text-[11px] text-gray-400 mt-5">v2.4.1 — Servidor: PROD-01</p>
      </div>
    </div>
  )
}
