import { ReservaRepository } from '../repositories'
import { Reserva } from '../entities'

export class ReservaService {
  private reservaRepository: ReservaRepository

  constructor() {
    this.reservaRepository = new ReservaRepository()
  }

  create = async (data: Reserva) => {
    return await this.reservaRepository.create(data)
  }

  getAll = async () => {
    return await this.reservaRepository.getAll()
  }

  getById = async (id: string) => {
    const reserva = await this.reservaRepository.getById(id)
    if (!reserva) return null

    return reserva
  }

  update = async (id: string, data: Partial<Reserva>) => {
    return await this.reservaRepository.update(id, data)
  }

  delete = async (id: string) => {
    return this.reservaRepository.delete(id)
  }
}
