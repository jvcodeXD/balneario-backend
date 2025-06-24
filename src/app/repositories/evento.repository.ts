import { In, Repository } from 'typeorm'
import { AppDataSource } from '../../config'
import { Ambiente, Evento } from '../entities'
import { TipoEvento } from '../dtos'

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

  getAll = async (filtros: Partial<Evento>) => {
    const query = this.repository
      .createQueryBuilder('evento')
      .leftJoinAndSelect('evento.ambientes', 'ambiente')
      .where('evento.deleted_at IS NULL')

    // Si se especifica la fecha, filtra eventos UNICO de esa fecha + todos los DIARIO
    if (filtros.fecha) {
      query.andWhere(
        `(evento.tipo = :diario OR (evento.tipo = :unico AND evento.fecha = :fecha))`,
        {
          diario: TipoEvento.DIARIO,
          unico: TipoEvento.UNICO,
          fecha: filtros.fecha
        }
      )
    }

    if (filtros.tipo) {
      query.andWhere('evento.tipo = :tipoFiltro', { tipoFiltro: filtros.tipo })
    }

    return await query.getMany()
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
