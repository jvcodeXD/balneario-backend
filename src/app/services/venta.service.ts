import { VentaRepository } from '../repositories'
import { Venta } from '../entities'
import { TipoAmbiente, TipoVenta } from '../dtos'

export class VentaService {
  private ventaRepository: VentaRepository

  constructor() {
    this.ventaRepository = new VentaRepository()
  }

  create = async (data: Partial<Venta>) => {
    const ahora = new Date()

    const fechaInicio = new Date(data.horaInicio!)
    const fechaFin = new Date(data.horaFin!)

    // Validar que la hora de finalización no sea anterior al momento actual
    if (fechaFin <= ahora) {
      throw new Error('La hora de finalización ya ha pasado.')
    }

    // Buscar ventas o reservas activas que se crucen en el mismo ambiente
    const conflictos = await this.ventaRepository.getConflictos(
      data.ambienteId!,
      fechaInicio,
      fechaFin
    )

    for (const conflicto of conflictos) {
      const esReserva = conflicto.tipo === 'RESERVADA'
      const minutosDesdeInicio =
        (ahora.getTime() - new Date(conflicto.horaInicio).getTime()) / 60000

      if (esReserva && minutosDesdeInicio >= 5) {
        // Cancelar la reserva vencida
        await this.ventaRepository.update(conflicto.id, {
          tipo: TipoVenta.CANCELADA
        })
      } else {
        throw new Error(
          'Ya existe una venta o reserva en este horario para este ambiente.'
        )
      }
    }

    // Guardar la venta
    return await this.ventaRepository.create(data)
  }

  getAll = async () => {
    return await this.ventaRepository.getAll()
  }

  getById = async (id: string) => {
    const venta = await this.ventaRepository.getById(id)
    if (!venta) return null

    return venta
  }

  update = async (id: string, data: Partial<Venta>) => {
    const ahora = new Date()

    const fechaInicio = new Date(data.horaInicio!)
    const fechaFin = new Date(data.horaFin!)

    if (fechaFin <= ahora) {
      throw new Error('La hora de finalización ya ha pasado.')
    }

    const conflictos = await this.ventaRepository.getConflictosExcluyendoId(
      id,
      data.ambienteId!,
      fechaInicio,
      fechaFin
    )

    for (const conflicto of conflictos) {
      const esReserva = conflicto.tipo === TipoVenta.RESERVADA
      const minutosDesdeInicio =
        (ahora.getTime() - new Date(conflicto.horaInicio).getTime()) / 60000

      if (esReserva && minutosDesdeInicio >= 5) {
        await this.ventaRepository.update(conflicto.id, {
          tipo: TipoVenta.CANCELADA
        })
      } else {
        throw new Error(
          'Ya existe una venta o reserva en este horario para este ambiente.'
        )
      }
    }

    return await this.ventaRepository.update(id, {
      ...data,
      updatedAt: ahora
    })
  }

  delete = async (id: string) => {
    return this.ventaRepository.delete(id)
  }

  getVentasByFecha = async (fecha: string, tipo?: TipoAmbiente) => {
    return await this.ventaRepository.getVentasByFecha(fecha, tipo)
  }
}
