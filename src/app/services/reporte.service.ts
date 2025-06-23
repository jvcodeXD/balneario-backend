import { TipoReporteUsuario } from '../dtos'
import { reporteDiarioUsuarioPDF } from './pdf.service'
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
}
