# TecnoInnova ERP

Sistema de Gestión Integral de Seguridad Electrónica — Next.js 14 + Prisma + PostgreSQL (Supabase).

## 🚀 Deploy en Vercel + Supabase (5 minutos)

### 1. Crear base de datos en Supabase
1. Ve a [supabase.com](https://supabase.com) y crea un proyecto nuevo.
2. Espera a que se provisione la base de datos.
3. Ve a **Project Settings → Database → Connection string**.
4. Copia la URI de PostgreSQL (modo `Session` o `Transaction`).
5. Reemplaza `[YOUR-PASSWORD]` con la contraseña que configuraste.

### 2. Configurar variables de entorno en Vercel
1. Sube este proyecto a GitHub.
2. Ve a [vercel.com](https://vercel.com) → **Add New Project** → importa tu repo.
3. En **Environment Variables**, agrega:

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
NEXTAUTH_URL=https://tu-proyecto.vercel.app
NEXTAUTH_SECRET=tecnoinnova-secret-key-2026-cambiar-en-produccion
```

4. Haz click en **Deploy**.

### 3. Sincronizar base de datos
Después del primer deploy, abre la consola de Vercel (o tu terminal local con `npx vercel --prod`):

```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npx prisma generate

# Push schema a Supabase
npx prisma db push

# Sembrar datos de ejemplo
npx prisma db seed
```

> Nota: Para correr `prisma db seed` en Vercel, usa el dashboard de Vercel → Functions → abre una función y ejecuta los comandos, o hazlo localmente apuntando a la DB de Supabase.

### 4. Credenciales de prueba
```
Usuario: admin@tecnoinnova.ec
Contraseña: admin123
```

O también:
```
Usuario: jefe@tecnoinnova.ec
Contraseña: admin123
```

## 📁 Estructura del Proyecto

```
tecnoinnova-nextjs/
├── prisma/
│   ├── schema.prisma      # Modelo de datos para Supabase (PostgreSQL)
│   └── seed.ts            # Datos de ejemplo
├── src/
│   ├── app/
│   │   ├── api/           # API Routes (Next.js App Router)
│   │   │   ├── auth/[...nextauth]/  # Autenticación
│   │   │   ├── pedidos/
│   │   │   ├── tecnicos/
│   │   │   ├── ordenes/
│   │   │   ├── inventario/
│   │   │   ├── facturas/
│   │   │   ├── postventa/
│   │   │   └── dashboard/stats/
│   │   ├── dashboard/page.tsx
│   │   ├── pedidos/page.tsx
│   │   ├── tecnicos/page.tsx
│   │   ├── inventario/page.tsx
│   │   ├── facturacion/page.tsx
│   │   ├── postventa/page.tsx
│   │   └── page.tsx        # Login
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   └── Providers.tsx
│   ├── lib/
│   │   ├── auth.ts         # NextAuth config
│   │   ├── prisma.ts       # Cliente Prisma singleton
│   │   │   └── utils.ts        # Helpers
│   └── types/
│       └── next-auth.d.ts  # Tipos extendidos
├── middleware.ts           # Protección de rutas
├── package.json
├── tailwind.config.ts
└── next.config.js
```

## 🔧 Desarrollo local

```bash
# 1. Clonar repo
git clone <repo-url>
cd tecnoinnova-nextjs

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env (copiar de .env.example)
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# 4. Sincronizar DB
npx prisma db push
npx prisma db seed

# 5. Iniciar servidor de desarrollo
npm run dev
# Abrir http://localhost:3000
```

## 🔄 Flujo de datos real

| Módulo | API Route | Métodos | Descripción |
|--------|-----------|---------|-------------|
| Auth | `/api/auth/[...nextauth]` | POST/GET | Login con JWT + sesiones |
| Pedidos | `/api/pedidos` | GET, POST | CRUD + validaciones automáticas |
| Técnicos | `/api/tecnicos` | GET | Listado con disponibilidad |
| Órdenes | `/api/ordenes` | GET, POST | Asignación + actualización de carga |
| Inventario | `/api/inventario` | GET, POST | Stock + solicitudes de reposición |
| Facturas | `/api/facturas` | GET, POST | Emisión + registro contable automático |
| Postventa | `/api/postventa` | GET, POST | Seguimiento + satisfacción |
| Dashboard | `/api/dashboard/stats` | GET | Métricas en tiempo real |

## 🛡️ Seguridad

- **Middleware** protege todas las rutas excepto login.
- **NextAuth v5** con JWT y sesiones seguras.
- **Prisma** con prepared statements (protección SQL Injection).
- Contraseñas hasheadas con **bcryptjs**.

## 📱 Responsive

El sidebar se adapta automáticamente en móviles (puedes agregar un menú hamburguesa si lo deseas).

---

**¿Problemas?** Revisa que `DATABASE_URL` y `DIRECT_URL` estén correctamente configuradas en Vercel y que la IP de Vercel esté permitida en Supabase (Network Restrictions → Allow all IPs temporalmente para pruebas).
