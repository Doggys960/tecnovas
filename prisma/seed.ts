import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Usuarios
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tecnoinnova.ec' },
    update: {},
    create: {
      email: 'admin@tecnoinnova.ec',
      name: 'Administrador',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  })
  const jefe = await prisma.user.upsert({
    where: { email: 'jefe@tecnoinnova.ec' },
    update: {},
    create: {
      email: 'jefe@tecnoinnova.ec',
      name: 'Jefe de Operaciones',
      password: await bcrypt.hash('admin123', 10),
      role: 'JEFE_OPERACIONES',
    },
  })

  // Clientes
  const clientes = await prisma.cliente.createMany({
    data: [
      { razon_social: 'Constructora Delta S.A.', ruc: '1791234567001', direccion: 'Av. Amazonas N24-56, Quito', telefono: '02-2345678', email: 'info@constructoradelta.ec' },
      { razon_social: 'Hotel Galápagos', ruc: '1798765432001', direccion: 'Av. Charles Darwin, Puerto Ayora', telefono: '05-2526100', email: 'reservas@hotelgalapagos.ec' },
      { razon_social: 'Bodegas El Sol', ruc: '1701122334001', direccion: 'Km 12.5 Vía a Daule, Guayaquil', telefono: '04-2567890', email: 'logistica@bodegaseisol.ec' },
      { razon_social: 'Clínica San Rafael', ruc: '1712345678001', direccion: 'Calle Larga 3-45, Cuenca', telefono: '07-2845678', email: 'admin@clinicasanrafael.ec' },
      { razon_social: 'Residencial Los Alamos', ruc: '1799988776001', direccion: 'Calle Eloy Alfaro, Quito', telefono: '02-2987654', email: 'admin@losalamos.ec' },
      { razon_social: 'Supermercados Maxi', ruc: '1711223344001', direccion: 'Av. Cevallos, Ambato', telefono: '03-2823456', email: 'compras@supermaxi.ec' },
    ],
    skipDuplicates: true,
  })

  // Técnicos
  await prisma.tecnico.createMany({
    data: [
      { nombre: 'Carlos Mendoza', zona_asignada: 'Norte (Quito)', disponible: true, carga_trabajo: 3, telefono: '0991234567', email: 'cmendoza@tecnoinnova.ec' },
      { nombre: 'Andrea Torres', zona_asignada: 'Sur (Guayaquil)', disponible: false, carga_trabajo: 5, telefono: '0992345678', email: 'atorres@tecnoinnova.ec' },
      { nombre: 'Luis Vargas', zona_asignada: 'Centro (Ambato)', disponible: true, carga_trabajo: 2, telefono: '0993456789', email: 'lvargas@tecnoinnova.ec' },
      { nombre: 'María Pérez', zona_asignada: 'Austro (Cuenca)', disponible: true, carga_trabajo: 1, telefono: '0994567890', email: 'mperez@tecnoinnova.ec' },
      { nombre: 'Juan Castro', zona_asignada: 'Galápagos', disponible: true, carga_trabajo: 0, telefono: '0995678901', email: 'jcastro@tecnoinnova.ec' },
    ],
    skipDuplicates: true,
  })

  // Proveedores
  await prisma.proveedor.createMany({
    data: [
      { razon_social: 'Distribuidora Seguridad S.A.', contacto: 'Pedro Gómez', email: 'ventas@distseguridad.ec', telefono: '02-2341100' },
      { razon_social: 'Importadora TecnoAndina', contacto: 'Ana Ruiz', email: 'compras@tecnoandina.ec', telefono: '02-2456789' },
      { razon_social: 'Hikvision Ecuador', contacto: 'Carlos López', email: 'ecuador@hikvision.com', telefono: '02-2987654' },
    ],
    skipDuplicates: true,
  })

  // Productos
  await prisma.producto.createMany({
    data: [
      { codigo_sku: 'CAM-HIK-4MP-001', nombre: 'Cámara IP 4MP Hikvision', categoria: 'Videovigilancia', stock_actual: 45, stock_minimo: 10, precio_unitario: 185.00, id_proveedor: 3 },
      { codigo_sku: 'DVR-HIK-16CH-001', nombre: 'DVR 16 canales Hikvision', categoria: 'Videovigilancia', stock_actual: 8, stock_minimo: 5, precio_unitario: 420.00, id_proveedor: 3 },
      { codigo_sku: 'SEN-DSC-PIR-001', nombre: 'Sensor PIR inalámbrico DSC', categoria: 'Alarmas', stock_actual: 62, stock_minimo: 15, precio_unitario: 35.00, id_proveedor: 1 },
      { codigo_sku: 'PAN-DSC-PS-001', nombre: 'Panel de control DSC PowerSeries', categoria: 'Alarmas', stock_actual: 4, stock_minimo: 5, precio_unitario: 280.00, id_proveedor: 1 },
      { codigo_sku: 'LEC-ZK-BIO-001', nombre: 'Lector biométrico ZK Teco', categoria: 'Control Acceso', stock_actual: 12, stock_minimo: 3, precio_unitario: 150.00, id_proveedor: 2 },
      { codigo_sku: 'CAB-UTP-CAT6-305', nombre: 'Cable UTP Cat6 (305m)', categoria: 'Cableado', stock_actual: 18, stock_minimo: 10, precio_unitario: 95.00, id_proveedor: 2 },
      { codigo_sku: 'FUE-12V-5A-001', nombre: 'Fuente 12V 5A conmutada', categoria: 'Energía', stock_actual: 3, stock_minimo: 8, precio_unitario: 45.00, id_proveedor: 2 },
      { codigo_sku: 'DD-WD-4TB-001', nombre: 'Disco duro 4TB WD Purple', categoria: 'Almacenamiento', stock_actual: 7, stock_minimo: 5, precio_unitario: 165.00, id_proveedor: 2 },
    ],
    skipDuplicates: true,
  })

  console.log('Seed completado ✅')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
