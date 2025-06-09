import { EventoRepository } from '../repositories'
import { Evento } from '../entities'

export class EventoService {
  private eventoRepository: EventoRepository

  constructor() {
    this.eventoRepository = new EventoRepository()
  }

  create = async (data: Partial<Evento>) => {
    return await this.eventoRepository.create(data)
  }

  getAll = async (filtros: Partial<Evento>) => {
    return await this.eventoRepository.getAll(filtros)
  }

  getById = async (id: string) => {
    const evento = await this.eventoRepository.getById(id)
    if (!evento) return null
    return evento
  }

  update = async (id: string, data: Partial<Evento>) => {
    return await this.eventoRepository.update(id, data)
  }

  delete = async (id: string) => {
    return await this.eventoRepository.delete(id)
  }
}
