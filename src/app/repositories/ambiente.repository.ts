import { Repository } from 'typeorm'
import { AppDataSource } from '../../config'
import { Ambiente } from '../entities'

export class AmbienteRepository {
  private repository: Repository<Ambiente>

  constructor() {
    this.repository = AppDataSource.getRepository(Ambiente)
  }

  create = async (data: Partial<Ambiente>) => {
    const ambiente = this.repository.create(data)
    return await this.repository.save(ambiente)
  }

  getAll = async () => {
    return await this.repository.find({
      relations: ['precio']
    })
  }

  getById = async (id: string) => {
    return await this.repository.findOne({
      where: { id },
      relations: ['precio']
    })
  }

  update = async (id: string, data: Partial<Ambiente>) => {
    const ambiente = await this.repository.findOne({
      where: { id }
    })
    if (!ambiente) return null
    Object.assign(ambiente, data)
    return await this.repository.save(ambiente)
  }

  delete = async (id: string) => {
    const ambiente = await this.getById(id)
    if (!ambiente) return false
    await this.repository.softRemove(ambiente)
    return true
  }
}
