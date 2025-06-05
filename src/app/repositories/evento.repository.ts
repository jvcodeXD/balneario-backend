import { In, Repository } from 'typeorm'
import { AppDataSource } from '../../config'
import { Ambiente, Evento } from '../entities'

export class EventoRepository {
  private repository: Repository<Evento>

  constructor() {
    this.repository = AppDataSource.getRepository(Evento)
  }

  create = async (data: Partial<Evento>) => {
    const { ambientes: ambienteIds, ...rest } = data

    const evento = this.repository.create(rest)

    if (ambienteIds && ambienteIds.length > 0) {
      // Asegúrate de obtener las entidades completas
      const ambienteRepository = AppDataSource.getRepository(Ambiente)
      evento.ambientes = await ambienteRepository.find({
        where: { id: In(ambienteIds) }
      })
    }

    return await this.repository.save(evento)
  }

  getAll = async () => {
    return await this.repository.find({
      relations: ['ambientes']
    })
  }

  getById = async (id: string) => {
    return await this.repository.findOne({
      where: { id },
      relations: ['ambientes']
    })
  }

  update = async (id: string, data: Partial<Evento>) => {
    const evento = await this.getById(id)
    if (!evento) return null

    const { ambientes: ambienteIds, ...rest } = data

    Object.assign(evento, rest)

    if (ambienteIds && Array.isArray(ambienteIds)) {
      const ambienteRepository = AppDataSource.getRepository(Ambiente)
      evento.ambientes = await ambienteRepository.find({
        where: { id: In(ambienteIds) }
      })
    }

    return await this.repository.save(evento)
  }

  delete = async (id: string) => {
    const evento = await this.getById(id)
    if (!evento) return false
    await this.repository.softRemove(evento)
    return true
  }
}
