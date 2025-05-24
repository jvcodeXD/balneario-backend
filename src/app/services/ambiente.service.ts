import { AmbienteRepository } from '../repositories'
import { Ambiente } from '../entities'

export class AmbienteService {
  private ambienteRepository: AmbienteRepository

  constructor() {
    this.ambienteRepository = new AmbienteRepository()
  }

  create = async (data: Ambiente) => {
    const existe = await this.ambienteRepository.findOne( { nombre: data.nombre } )
    if (existe) {
      throw new Error('Ese nombre ya existe')
    }
    return await this.ambienteRepository.create(data)
  }

  getAll = async () => {
    return await this.ambienteRepository.getAll()
  }

  getById = async (id: string) => {
    const ambiente = await this.ambienteRepository.getById(id)
    if (!ambiente) return null

    return ambiente
  }

  update = async (id: string, data: Partial<Ambiente>) => {
    return await this.ambienteRepository.update(id, data)
  }

  delete = async (id: string) => {
    return this.ambienteRepository.delete(id)
  }
}
