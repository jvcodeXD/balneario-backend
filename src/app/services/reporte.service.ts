import { TipoReporteUsuario } from '../dtos'
import { UserService } from './user.service'
import { VentaService } from './venta.service'

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
}
