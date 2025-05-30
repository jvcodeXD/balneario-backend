import PDFDocument from 'pdfkit'
import { Response } from 'express'
import { VentaService } from '.'
import { format } from 'date-fns'
import { TipoAmbiente } from '../dtos'

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
  const fecha = format(new Date(venta.fecha), 'dd/MM/yyyy HH:mm')
  doc.fontSize(7).text(`Fecha: ${fecha}`, { align: 'center' })
  doc.moveDown(0.5)

  // Línea superior
  const pageWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right
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
    ['Hora Inicio:', format(new Date(venta.horaInicio), 'HH:mm')],
    ['Hora Fin:', format(new Date(venta.horaFin), 'HH:mm')]
  ]
  if (
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
