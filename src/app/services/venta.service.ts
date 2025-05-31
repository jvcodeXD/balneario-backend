import { VentaRepository } from '../repositories'
import { Venta } from '../entities'
import { TipoAmbiente } from '../dtos'

export class VentaService {
  private ventaRepository: VentaRepository

  constructor() {
    this.ventaRepository = new VentaRepository()
  }

  create = async (data: Venta) => {
    return await this.ventaRepository.create(data)
  }

  getAll = async () => {
    return await this.ventaRepository.getAll()
  }

  getById = async (id: string) => {
    const venta = await this.ventaRepository.getById(id)
    if (!venta) return null

    return venta
  }

  update = async (id: string, data: Partial<Venta>) => {
    return await this.ventaRepository.update(id, data)
  }

  delete = async (id: string) => {
    return this.ventaRepository.delete(id)
  }

  getVentasByFecha = async (fecha: string, tipo?:TipoAmbiente) => {
    const date = new Date(fecha)
    return await this.ventaRepository.getVentasByFecha(date,tipo)
  }
}

