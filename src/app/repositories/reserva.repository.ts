import { Repository } from 'typeorm'
import { AppDataSource } from '../../config'
import { Reserva } from '../entities'

export class ReservaRepository {
  private repository: Repository<Reserva>

  constructor() {
    this.repository = AppDataSource.getRepository(Reserva)
  }

  create = async (data: Partial<Reserva>) => {
    const reserva = this.repository.create(data)
    return await this.repository.save(reserva)
  }

  getAll = async () => {
    return await this.repository.find({
      relations: ['venta']
    })
  }

  getById = async (id: string) => {
    return await this.repository.findOne({
      where: { id },
      relations: ['venta']
    })
  }

  update = async (id: string, data: Partial<Reserva>) => {
    const reserva = await this.repository.findOne({
      where: { id }
    })
    if (!reserva) return null
    Object.assign(reserva, data)
    return await this.repository.save(reserva)
  }

  delete = async (id: string) => {
    const reserva = await this.getById(id)
    if (!reserva) return false
    await this.repository.softRemove(reserva)
    return true
  }
}
