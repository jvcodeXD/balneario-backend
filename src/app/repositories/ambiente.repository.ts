import { Repository, IsNull} from 'typeorm'
import { AppDataSource } from '../../config'
import { Ambiente } from '../entities'
import { EstadoAmbiente, TipoAmbiente } from '../dtos'


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
      relations: ['precio'],
      order: {
        nombre: 'ASC'
      }
    })
  }

  getById = async (id: string) => {
    return await this.repository.findOne({
      where: { id },
      relations: ['precio']
    })
  }

  getByTipo = async (tipo: TipoAmbiente) => {
    return await this.repository.find({
      where: { tipo, deletedAt: IsNull() },
      order: { nombre: 'ASC' },
      relations: ['precio']
    })
  }

  getHabilitados = async () => {
    return await this.repository.find({
      where: { estado: EstadoAmbiente.HABILITADO, deletedAt: IsNull() },
      order: { nombre: 'ASC' },
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

  findOne = async (where: Partial<Ambiente>) => {
    return await this.repository.findOne({
      where: { ...where }
    })
  }
}
