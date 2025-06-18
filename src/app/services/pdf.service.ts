import PDFDocument from 'pdfkit'
import { Response } from 'express'
import { UserService, VentaService } from '.'
import { format } from 'date-fns'
import { TipoAmbiente, TipoVenta, VentaInterface } from '../dtos'

export const generarReciboPiscina = async (
  res: Response,
  ninos: number,
  adultos: number,
  usuarioId: string,
  precioNino: string,
  precioAdulto: string
) => {
  const userService = new UserService()
  const usuario = await userService.getById(usuarioId)
  const totalNinos = ninos * Number(precioNino)
  const totalAdultos = adultos * Number(precioAdulto)
  const precioTotal = totalNinos + totalAdultos

  const doc = new PDFDocument({
    size: [180, 180], // Tamaño para impresora térmica
    margin: 15
  })

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'inline; filename="recibo_piscina.pdf"')
  doc.pipe(res)

  // Encabezado
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('RECIBO SAUNA MIXTO', { align: 'center' })
  doc.moveDown(0.2)

  // Fecha y hora

  // Fecha
  const fecha = format(new Date(), 'dd/MM/yyyy HH:mm')
  doc.fontSize(7).text(`Fecha: ${fecha}`, {
    align: 'center'
  })
  doc.moveDown(0.5)

  // Línea superior
  doc.moveDown(0.3)
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke()

  // Detalles
  doc.moveDown(0.5)
  doc.fontSize(9)

  const datos = [
    [`Niños (${ninos}): `, `${totalNinos} Bs`],
    [`Adultos (${adultos}): `, `${totalAdultos} Bs`],
    ['Total:', `${precioTotal} Bs`]
  ]

  const startX = doc.x
  const col1Width = 60
  const col2Width = 90

  datos.forEach(([label, value]) => {
    const y = doc.y
    doc
      .text(label, startX, y, { width: col1Width, align: 'left' })
      .font('Times-Roman')
    doc
      .text(value, startX + col1Width, y, { width: col2Width, align: 'right' })
      .font('Helvetica-Bold')
    doc.moveDown(0.2)
  })

  // Línea inferior
  doc.moveDown(0.3)
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke()

  // Vendedor
  doc.moveDown(1)
  doc
    .fontSize(5)
    .font('Helvetica-Oblique')
    .text('Atendido por: ' + (usuario?.fullName || 'N/A'), {
      align: 'right'
    })

  // Mensaje final
  doc.x = doc.page.margins.left
  doc.moveDown(1.5)
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .text('Gracias por su visita...!!!', { align: 'center' })

  doc.end()
}

export const generarReciboPDF = async (res: Response, id: string) => {
  const ventaService = new VentaService()
  const venta = await ventaService.getById(id)

  if (!venta) {
    return res.status(404).json({ error: 'Venta no encontrada' })
  }

  const doc = new PDFDocument({
    size: [180, 190], // Tamaño pequeño para térmica
    margin: 15
  })

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'inline; filename="recibo.pdf"')
  doc.pipe(res)

  // Encabezado
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('RECIBO DE VENTA', { align: 'center' })
  doc.moveDown(0.2)

  // Fecha
  const fecha = format(new Date(venta.created_at), 'dd/MM/yyyy HH:mm')
  doc.fontSize(7).text(`Fecha: ${fecha}`, { align: 'center' })
  doc.moveDown(0.5)

  // Línea superior
  doc.moveDown(0.3)
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke()

  // Datos alineados
  doc.moveDown(0.5)
  doc.fontSize(9)

  const datos = [
    ['Cliente:', venta.nombreCliente || 'N/A'],
    ['Ambiente:', venta.ambiente?.nombre || 'N/A'],
    ['Hora Inicio:', format(new Date(venta.hora_inicio), 'HH:mm')],
    ['Hora Fin:', format(new Date(venta.horaFin), 'HH:mm')]
  ]
  if (venta.tipo === TipoVenta.RESERVADA) {
    datos.push(['Adelanto:', `${venta.adelanto} Bs`])
  }
  if (
    venta.ambiente &&
    venta.ambiente.tipo !== TipoAmbiente.FAMILIAR &&
    venta.ambiente.tipo !== TipoAmbiente.SAUNA
  )
    datos.push(['Personas:', venta.cantidad.toString()])
  datos.push(['Total:', `${venta.precioTotal} Bs`])

  const startX = doc.x
  const col1Width = 60
  const col2Width = 90

  datos.forEach(([label, value]) => {
    const y = doc.y
    doc
      .text(label, startX, y, { width: col1Width, align: 'left' })
      .font('Times-Roman')
    doc
      .text(value, startX + col1Width, y, { width: col2Width, align: 'right' })
      .font('Helvetica-Bold')
    doc.moveDown(0.2)
  })

  // Línea inferior
  doc.moveDown(0.3)
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke()

  // Nombre del usuario
  doc.moveDown(1)
  doc
    .fontSize(5)
    .font('Helvetica-Oblique')
    .text('Atendido por: ' + (venta.usuario?.fullName || 'N/A'), {
      align: 'right'
    })

  // Mensaje final
  doc.x = doc.page.margins.left
  doc.moveDown(1.5)
  doc.font('Helvetica-Bold').fontSize(9)
  doc.text('Gracias por su visita...!!!', { align: 'center' })

  doc.end()
}

const seccionSaunaMixto = (
  doc: PDFKit.PDFDocument,
  ventas: VentaInterface[],
  startX: number
) => {
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('SAUNA MIXTO', { underline: true })
  doc.moveDown(0.5)

  const headers = ['Fecha', 'Hora', 'Cantidad', 'Total', 'Recibido']
  const columnWidths = [60, 70, 195, 75, 80]
  const baseY = doc.y

  doc.fontSize(9).font('Helvetica-Bold')
  headers.forEach((header, i) => {
    const offsetX = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0)
    doc.text(header, offsetX, baseY, {
      width: columnWidths[i],
      align: i >= 4 ? 'right' : 'left'
    })
  })
  doc.moveDown(0.2)
  doc
    .moveTo(startX, doc.y)
    .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), doc.y)
    .stroke()

  let total = 0

  // 🔹 Agrupar por fecha (sin hora)
  const agrupadoPorFecha: Record<string, VentaInterface[]> = {}
  ventas.forEach((v) => {
    const key = format(new Date(v.created_at!), 'yyyy-MM-dd')
    if (!agrupadoPorFecha[key]) agrupadoPorFecha[key] = []
    agrupadoPorFecha[key].push(v)
  })

  doc.font('Helvetica')

  for (const fecha of Object.keys(agrupadoPorFecha)) {
    // 👉 Fecha agrupada en Helvetica-Bold
    doc.fontSize(9).font('Helvetica-Bold').text(fecha, startX, doc.y)
    doc.moveDown(0.2)

    doc.font('Helvetica') // ⬅️ Volver a fuente normal para filas

    agrupadoPorFecha[fecha].forEach((venta) => {
      // ⚠️ Verificar si hay espacio suficiente para una nueva fila
      if (doc.y + 15 >= doc.page.height - doc.page.margins.bottom) {
        doc.addPage()
        doc.y = doc.page.margins.top
      }

      const recibido = calcularRecibido(venta)
      const cantidadStr = `${venta.cantidad ?? 1} (${
        venta.ambiente?.nombre === 'PISCINA NIÑOS' ? 'Niños' : 'Adultos'
      })`

      const data = [
        format(new Date(venta.created_at!), 'HH:mm'),
        format(new Date(venta.hora_inicio), 'HH:mm'),
        cantidadStr,
        `${Number(venta.precioTotal).toFixed(2)} Bs`,
        `${Number(recibido).toFixed(2)} Bs`
      ]

      const y = doc.y
      data.forEach((val, i) => {
        doc.text(
          val,
          startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
          y,
          {
            width: columnWidths[i],
            align: i >= 4 ? 'right' : 'left'
          }
        )
      })

      total += Number(recibido)
      doc.moveDown(0.3)
    })
  }

  doc.moveDown(0.3)
  doc
    .font('Helvetica-Bold')
    .text(`TOTAL SAUNA MIXTO: ${Number(total).toFixed(2)} Bs.`, startX, doc.y, {
      width: columnWidths.reduce((a, b) => a + b, 0),
      align: 'right'
    })

  doc.moveDown()
}

const seccionSauna = (
  doc: PDFKit.PDFDocument,
  ventas: VentaInterface[],
  startX: number
) => {
  doc.fontSize(12).font('Helvetica-Bold').text('SAUNA', { underline: true })
  doc.moveDown(0.5)

  const headers = [
    'Fecha',
    'Hora',
    'Tipo de Venta',
    'Adelanto',
    'Total',
    'Recibido'
  ]
  const columnWidths = [60, 130, 50, 80, 80, 80]
  const headerHeight = 12

  doc.fontSize(9).font('Helvetica-Bold')
  const baseY = doc.y
  headers.forEach((header, i) => {
    const offsetX = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0)
    doc.text(header, offsetX, baseY, {
      width: columnWidths[i],
      align: i >= 3 ? 'right' : 'left'
    })
  })
  doc.moveDown(1)
  doc
    .moveTo(startX, doc.y)
    .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), doc.y)
    .stroke()

  let total = 0
  const agrupado: Record<string, VentaInterface[]> = {}
  ventas.forEach((v) => {
    const key = format(new Date(v.created_at!), 'yyyy-MM-dd')
    if (!agrupado[key]) agrupado[key] = []
    agrupado[key].push(v)
  })

  doc.font('Helvetica')
  for (const fecha of Object.keys(agrupado)) {
    if (doc.y + 25 > doc.page.height - doc.page.margins.bottom) doc.addPage()
    doc.fontSize(9).font('Helvetica-Bold').text(fecha, startX, doc.y)
    doc.moveDown(0.2)
    doc.font('Helvetica')

    agrupado[fecha].forEach((venta) => {
      if (doc.y + 20 > doc.page.height - doc.page.margins.bottom) doc.addPage()
      const adelanto = Number(venta.adelanto ?? 0)
      const totalBs = Number(venta.precioTotal ?? 0)
      const recibido = calcularRecibido(venta)

      const fila = [
        format(new Date(venta.created_at!), 'HH:mm'),
        `${format(new Date(venta.hora_inicio), 'yyyy-MM-dd')} (${format(
          new Date(venta.hora_inicio),
          'HH:mm'
        )} - ${format(new Date(venta.horaFin), 'HH:mm')})`,
        textoVenta(venta),
        `${adelanto.toFixed(2)} Bs`,
        `${totalBs.toFixed(2)} Bs`,
        `${Number(recibido).toFixed(2)} Bs`
      ]

      const y = doc.y
      fila.forEach((val, i) => {
        const offsetX =
          startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0)
        doc.text(val, offsetX, y, {
          width: columnWidths[i],
          align: i >= 3 ? 'right' : 'left'
        })
      })

      total += Number(recibido)
      doc.moveDown(0.2)
    })
  }

  doc.moveDown(0.3)
  doc
    .font('Helvetica-Bold')
    .text(`TOTAL SAUNA: ${Number(total).toFixed(2)} Bs.`, startX, doc.y, {
      width: columnWidths.reduce((a, b) => a + b, 0),
      align: 'right'
    })
  doc.moveDown()
}

const seccionFamiliar = (
  doc: PDFKit.PDFDocument,
  ventas: VentaInterface[],
  startX: number
) => {
  doc.fontSize(12).font('Helvetica-Bold').text('FAMILIAR', { underline: true })
  doc.moveDown(0.5)

  const headers = [
    'Fecha',
    'Hora',
    'Tipo de Venta',
    'Adelanto',
    'Total',
    'Recibido'
  ]
  const columnWidths = [60, 130, 50, 80, 80, 80]

  doc.fontSize(9).font('Helvetica-Bold')
  const baseY = doc.y
  headers.forEach((header, i) => {
    const offsetX = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0)
    doc.text(header, offsetX, baseY, {
      width: columnWidths[i],
      align: i >= 3 ? 'right' : 'left'
    })
  })
  doc.moveDown(1)
  doc
    .moveTo(startX, doc.y)
    .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), doc.y)
    .stroke()

  let total = 0
  const agrupado: Record<string, VentaInterface[]> = {}
  ventas.forEach((v) => {
    const key = format(new Date(v.created_at!), 'yyyy-MM-dd')
    if (!agrupado[key]) agrupado[key] = []
    agrupado[key].push(v)
  })

  doc.font('Helvetica')
  for (const fecha of Object.keys(agrupado)) {
    if (doc.y + 25 > doc.page.height - doc.page.margins.bottom) doc.addPage()
    doc.fontSize(9).font('Helvetica-Bold').text(fecha, startX, doc.y)
    doc.moveDown(0.2)
    doc.font('Helvetica')

    agrupado[fecha].forEach((venta) => {
      if (doc.y + 20 > doc.page.height - doc.page.margins.bottom) doc.addPage()
      const adelanto = Number(venta.adelanto ?? 0)
      const totalBs = Number(venta.precioTotal ?? 0)
      const recibido = calcularRecibido(venta)

      const fila = [
        format(new Date(venta.created_at!), 'HH:mm'),
        `${format(new Date(venta.hora_inicio), 'yyyy-MM-dd')} (${format(
          new Date(venta.hora_inicio),
          'HH:mm'
        )} - ${format(new Date(venta.horaFin), 'HH:mm')})`,
        textoVenta(venta),
        `${Number(adelanto).toFixed(2)} Bs`,
        `${Number(totalBs).toFixed(2)} Bs`,
        `${Number(recibido).toFixed(2)} Bs`
      ]

      const y = doc.y
      fila.forEach((val, i) => {
        const offsetX =
          startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0)
        doc.text(val, offsetX, y, {
          width: columnWidths[i],
          align: i >= 3 ? 'right' : 'left'
        })
      })

      total += Number(recibido)
      doc.moveDown(0.2)
    })
  }

  doc.moveDown(0.3)
  doc
    .font('Helvetica-Bold')
    .text(`TOTAL FAMILIAR: ${Number(total).toFixed(2)} Bs.`, startX, doc.y, {
      width: columnWidths.reduce((a, b) => a + b, 0),
      align: 'right'
    })
  doc.moveDown()
}

const seccionIndividual = (
  doc: PDFKit.PDFDocument,
  ventas: VentaInterface[],
  startX: number
) => {
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('INDIVIDUAL', { underline: true })
  doc.moveDown(0.5)

  const headers = [
    'Fecha',
    'Hora',
    'Tipo de Venta',
    'Cantidad',
    'Adelanto',
    'Total',
    'Recibido'
  ]
  const columnWidths = [60, 130, 50, 50, 60, 60, 70]

  doc.fontSize(9).font('Helvetica-Bold')
  const baseY = doc.y
  headers.forEach((header, i) => {
    const offsetX = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0)
    doc.text(header, offsetX, baseY, {
      width: columnWidths[i],
      align: i > 4 ? 'right' : i == 3 ? 'center' : 'left'
    })
  })
  doc.moveDown(1)
  doc
    .moveTo(startX, doc.y)
    .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), doc.y)
    .stroke()

  let total = 0
  const agrupado: Record<string, VentaInterface[]> = {}
  ventas.forEach((v) => {
    const key = format(new Date(v.created_at!), 'yyyy-MM-dd')
    if (!agrupado[key]) agrupado[key] = []
    agrupado[key].push(v)
  })

  doc.font('Helvetica')
  for (const fecha of Object.keys(agrupado)) {
    if (doc.y + 25 > doc.page.height - doc.page.margins.bottom) doc.addPage()
    doc.fontSize(9).font('Helvetica-Bold').text(fecha, startX, doc.y)
    doc.moveDown(0.2)
    doc.font('Helvetica')

    agrupado[fecha].forEach((venta) => {
      if (doc.y + 20 > doc.page.height - doc.page.margins.bottom) doc.addPage()
      const adelanto = Number(venta.adelanto ?? 0)
      const totalBs = Number(venta.precioTotal ?? 0)
      const recibido = calcularRecibido(venta)

      const fila = [
        format(new Date(venta.created_at!), 'HH:mm'),
        `${format(new Date(venta.hora_inicio), 'yyyy-MM-dd')} (${format(
          new Date(venta.hora_inicio),
          'HH:mm'
        )} - ${format(new Date(venta.horaFin), 'HH:mm')})`,
        textoVenta(venta),
        `${venta.cantidad ?? 1}`,
        `${Number(adelanto).toFixed(2)} Bs`,
        `${Number(totalBs).toFixed(2)} Bs`,
        `${Number(recibido).toFixed(2)} Bs`
      ]

      const y = doc.y
      fila.forEach((val, i) => {
        const offsetX =
          startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0)
        doc.text(val, offsetX, y, {
          width: columnWidths[i],
          align: i > 4 ? 'right' : i == 3 ? 'center' : 'left'
        })
      })

      total += Number(recibido)
      doc.moveDown(0.2)
    })
  }

  doc.moveDown(0.3)
  doc
    .font('Helvetica-Bold')
    .text(`TOTAL INDIVIDUAL: ${Number(total).toFixed(2)} Bs.`, startX, doc.y, {
      width: columnWidths.reduce((a, b) => a + b, 0),
      align: 'right'
    })
  doc.moveDown()
}

export const reporteDiarioUsuarioPDF = async (
  res: Response,
  idUsuario: string,
  ventas: VentaInterface[],
  fechaInicio: Date,
  fechaFin: Date
) => {
  const userService = new UserService()
  const usuario = await userService.getById(idUsuario)
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: {
      top: 50,
      bottom: 50,
      left: 85, // 3 cm
      right: 57 // 2 cm
    }
  })

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'inline; filename="reporte_ventas.pdf"')
  doc.pipe(res)

  // Encabezado
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('REPORTE DE VENTAS', { align: 'center' })
  doc.moveDown(0.5)
  doc.fontSize(10).text(`Usuario: ${usuario?.fullName || 'N/A'}`)
  doc.text(
    `Periodo: ${format(fechaInicio, 'yyyy-MM-dd')} al ${format(
      fechaFin,
      'yyyy-MM-dd'
    )}`
  )
  doc.moveDown()

  // Filtrar solo SAUNA_MIXTO
  const saunaMixtoVentas = ventas.filter(
    (v) => v.ambiente?.tipo === TipoAmbiente.SAUNA_MIXTO
  )
  const saunaVentas = ventas.filter(
    (v) => v.ambiente?.tipo === TipoAmbiente.SAUNA
  )

  const ventasFamiliar = ventas.filter(
    (v) => v.ambiente?.tipo === TipoAmbiente.FAMILIAR
  )

  const ventasIndividual = ventas.filter(
    (v) => v.ambiente?.tipo === TipoAmbiente.INDIVIDUAL
  )

  if (saunaMixtoVentas.length) {
    seccionSaunaMixto(doc, saunaMixtoVentas, doc.page.margins.left)
  }

  if (ventasIndividual.length) {
    seccionIndividual(doc, ventasIndividual, doc.page.margins.left)
  }

  if (saunaVentas.length) {
    seccionSauna(doc, saunaVentas, doc.page.margins.left)
  }

  if (ventasFamiliar.length) {
    seccionFamiliar(doc, ventasFamiliar, doc.page.margins.left)
  }

  doc
    .fontSize(10)
    .font('Helvetica-Oblique')
    .text('Gracias por su trabajo.', { align: 'center' })

  // 🔹 Agrupar por tipo de ambiente
  const totalesAmbientes: Record<string, number> = {}
  ventas.forEach((v) => {
    const tipo = v.ambiente?.tipo ?? 'SIN_TIPO'
    const recibido = calcularRecibido(v)
    if (!totalesAmbientes[tipo]) totalesAmbientes[tipo] = 0
    totalesAmbientes[tipo] += Number(recibido)
  })

  // 🔹 Agrupar por tipo de venta
  const totalesVenta: Record<string, number> = {}
  ventas.forEach((v) => {
    const tipo = v.tipo
    const recibido = calcularRecibido(v)
    if (!totalesVenta[tipo]) totalesVenta[tipo] = 0
    totalesVenta[tipo] += Number(recibido)
  })
  // ⬇ Nuevo resumen en una nueva página si falta espacio
  if (doc.y + 120 > doc.page.height - doc.page.margins.bottom) doc.addPage()

  const startX = doc.page.margins.left
  doc.fontSize(12).font('Helvetica-Bold').text('RESUMEN DE VENTAS', startX)
  doc.moveDown(1)

  // 👉 Resumen por ambiente
  doc.fontSize(10).font('Helvetica-Bold').text('Por Tipo de Ambiente:', startX)
  doc.moveDown(0.3)
  doc.font('Helvetica')

  let sumaAmbiente = 0
  Object.entries(totalesAmbientes).forEach(([tipo, total]) => {
    sumaAmbiente += Number(total)
    doc.text(`${tipo}: ${Number(total).toFixed(2)} Bs.`, startX)
  })
  doc.font('Helvetica-Bold')
  doc.text(`Total Ambientes: ${Number(sumaAmbiente).toFixed(2)} Bs.`, startX)
  doc.moveDown(1)

  // 👉 Resumen por tipo de venta
  doc.fontSize(10).font('Helvetica-Bold').text('Por Tipo de Venta:', startX)
  doc.moveDown(0.3)
  doc.font('Helvetica')

  let sumaVenta = 0
  Object.entries(totalesVenta).forEach(([tipo, total]) => {
    sumaVenta += Number(total)
    doc.text(`${tipo}: ${Number(total).toFixed(2)} Bs.`, startX)
  })
  doc.font('Helvetica-Bold')
  doc.text(`Total Ventas: ${Number(sumaVenta).toFixed(2)} Bs.`, startX)
  doc.moveDown(1)
  doc.end()
}

// Helpers de cálculo:

const textoVenta = (venta: VentaInterface) => {
  if (venta.tipo === TipoVenta.CANCELADA) return 'Cancelada'
  if (venta.tipo === TipoVenta.RESERVADA || venta.tipo === TipoVenta.FINALIZADA)
    return 'Reservada'
  if (venta.tipo === TipoVenta.RESTANTE) return 'Restante'
  return 'Inmediata'
}

const calcularRecibido = (venta: VentaInterface): number => {
  if (venta.tipo === TipoVenta.CANCELADA) return -(venta.adelanto ?? 0)
  if (venta.tipo === TipoVenta.RESERVADA || venta.tipo === TipoVenta.FINALIZADA)
    return venta.adelanto ?? 0
  if (venta.tipo === TipoVenta.RESTANTE)
    return (venta.precioTotal ?? 0) - (venta.adelanto ?? 0)
  return venta.precioTotal ?? 0
}
