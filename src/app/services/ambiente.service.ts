import { AmbienteRepository } from '../repositories'
import { Ambiente } from '../entities'
import { TipoAmbiente } from '../dtos'

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

  getAll = async (filtros: Partial<Ambiente>) => {
    return await this.ambienteRepository.getAll(filtros)
  }

  getById = async (id: string) => {
    const ambiente = await this.ambienteRepository.getById(id)
    if (!ambiente) return null

    return ambiente
  }

  update = async (id: string, data: Partial<Ambiente>) => {
    const existe = await this.ambienteRepository.findOne( { nombre: data.nombre } )
    if (existe && existe.id!==id) {
      throw new Error('Ese nombre ya existe')
    }
    return await this.ambienteRepository.update(id, data)
  }

  delete = async (id: string) => {
    return this.ambienteRepository.delete(id)
  }
}
