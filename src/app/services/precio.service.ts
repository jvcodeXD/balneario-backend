import { PrecioRepository } from '../repositories'
import { Precio } from '../entities'

export class PrecioService {
  private precioRepository: PrecioRepository

  constructor() {
    this.precioRepository = new PrecioRepository()
  }

  create = async (data: Precio) => {
    return await this.precioRepository.create(data)
  }

  getAll = async () => {
    return await this.precioRepository.getAll()
  }

  getById = async (id: string) => {
    const precio = await this.precioRepository.getById(id)
    if (!precio) return null
    return precio
  }

  update = async (id: string, data: Partial<Precio>) => {
    return await this.precioRepository.update(id, data)
  }

  delete = async (id: string) => {
    return this.precioRepository.delete(id)
  }
}
