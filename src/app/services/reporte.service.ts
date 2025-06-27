import { TipoReporteUsuario } from '../dtos'
import { reporteDiarioUsuarioPDF, reporteVentasUsuarios } from './pdf.service'
import { UserService } from './user.service'
import { VentaService } from './venta.service'
import { Response } from 'express'

export class ReporteService {
  private userService: UserService
  private ventaService: VentaService

  constructor() {
    this.userService = new UserService()
    this.ventaService = new VentaService()
  }

  reporteDiarioUsuario = async (
    fechaInicio: Date,
    fechaFin: Date,
    idUsuario: string
  ) => {
    const usuario = await this.userService.getById(idUsuario)
    const ventas = await this.ventaService.getVentasByUsuario(
      fechaInicio,
      fechaFin,
      idUsuario
    )
    console.log(ventas)
    return {
      usuario,
      ventas
    }
  }

  reporteDiarioUsuarioPDF = async (
    res: Response,
    fechaInicio: Date,
    fechaFin: Date,
    idUsuario: string
  ) => {
    const ventas = await this.ventaService.getVentasByUsuario(
      fechaInicio,
      fechaFin,
      idUsuario
    )
    reporteDiarioUsuarioPDF(res, idUsuario, ventas, fechaInicio, fechaFin)
  }

  reporteVentasTipoAmbiente = async (fechaInicio: Date, fechaFin: Date) => {
    return await this.ventaService.reporteVentasTipoAmbiente(
      fechaInicio,
      fechaFin
    )
  }

  reporteIngresoUsuarios = async (fechaInicio: Date, fechaFin: Date) => {
    return await this.ventaService.reporteVentasUsuario(fechaInicio, fechaFin)
  }

  reporteIngresoUsuariosPDF = async (
    res: Response,
    fechaInicio: Date,
    fechaFin: Date
  ) => {
    const ventas = await this.ventaService.reporteVentasUsuario(
      fechaInicio,
      fechaFin
    )

    // Agrupado por fecha
    const agrupado: Record<string, any[]> = {}
    ventas.forEach((v) => {
      const fecha = new Date(v.fecha).toISOString().split('T')[0] // yyyy-MM-dd
      if (!agrupado[fecha]) agrupado[fecha] = []
      agrupado[fecha].push({
        usuario_id: v.usuario_id,
        fullname: v.fullname,
        cantidad_ventas: v.cantidad_ventas,
        total_ventas: v.total_ventas
      })
    })

    // Resumen General
    const resumen: Record<
      string,
      { fullname: string; cantidad_ventas: number; total_ventas: number }
    > = {}
    ventas.forEach((v) => {
      if (!resumen[v.usuario_id]) {
        resumen[v.usuario_id] = {
          fullname: v.fullname,
          cantidad_ventas: 0,
          total_ventas: 0
        }
      }
      resumen[v.usuario_id].cantidad_ventas += v.cantidad_ventas
      resumen[v.usuario_id].total_ventas += v.total_ventas
    })

    // Preparas todo en un solo objeto
    const datosFormateados = {
      rango: {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      },
      agrupado,
      resumen: Object.values(resumen)
    }

    // Envías los datos al generador del PDF
    reporteVentasUsuarios(res, datosFormateados)
  }
}
