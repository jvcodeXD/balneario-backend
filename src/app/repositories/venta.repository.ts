import { Repository, Not, In, LessThan, MoreThan, IsNull } from 'typeorm'
import { AppDataSource, logger } from '../../config'
import { Venta } from '../entities'
import { TipoAmbiente, TipoVenta } from '../dtos'
import { DateHelper } from '../../utils'

export class VentaRepository {
  private repository: Repository<Venta>

  constructor() {
    this.repository = AppDataSource.getRepository(Venta)
  }

  create = async (data: Partial<Venta>) => {
    // const ahora = DateHelper.getLocalDate()
    const ahora = new Date()

    const venta = this.repository.create({
      ...data,
      created_at: ahora,
      updated_at: ahora
    })

    return await this.repository.save(venta)
  }

  getConflictos = async (ambienteId: string, inicio: Date, fin: Date) => {
    return await this.repository.find({
      where: {
        ambienteId: ambienteId,
        deletedAt: IsNull(),
        tipo: Not(In(['CANCELADA', 'FINALIZADA'])),
        hora_inicio: LessThan(fin),
        horaFin: MoreThan(inicio)
      }
    })
  }

  getConflictosExcluyendoId = async (
    id: string,
    ambienteId: string,
    horaInicio: Date,
    horaFin: Date
  ) => {
    return await this.repository.find({
      where: {
        id: Not(id),
        ambienteId: ambienteId,
        deletedAt: IsNull(),
        tipo: Not(In(['CANCELADA', 'FINALIZADA'])),
        hora_inicio: LessThan(horaFin),
        horaFin: MoreThan(horaInicio)
      }
    })
  }

  getAll = async (filtros: any) => {
    const query = this.repository
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.ambiente', 'ambiente')
      .leftJoinAndSelect('venta.usuario', 'usuario')
      .where('venta.deletedAt IS NULL')
      .andWhere('venta.tipo NOT IN (:...tiposExcluidos)', {
        tiposExcluidos: [TipoVenta.CANCELADA, TipoVenta.FINALIZADA]
      })

    if (filtros.fecha) {
      query.andWhere('venta.hora_inicio::date = :fecha', {
        fecha: filtros.fecha
      })
    }

    if (filtros.tipo) {
      query.andWhere('ambiente.tipo = :tipoAmbiente', {
        tipoAmbiente: filtros.tipo
      })
    }

    return await query.getMany()
  }

  getVentasByFecha = async (fecha: string, tipo?: TipoAmbiente) => {
    const inicio = new Date(`${fecha} 00:00:00`)
    const fin = new Date(`${fecha} 23:59:59`)
    const query = this.repository
      .createQueryBuilder('venta')
      .leftJoin('venta.ambiente', 'ambiente')
      .select('venta.ambienteId', 'ambienteId')
      .addSelect('ambiente.nombre', 'nombreAmbiente')
      .addSelect('ambiente.tipo', 'tipoAmbiente')
      .addSelect('SUM(venta.cantidad)', 'cantidad')
      .where('venta.hora_inicio BETWEEN :inicio AND :fin', { inicio, fin })

    if (tipo) {
      query.andWhere('ambiente.tipo = :tipo', { tipo })
    }

    const ventas = await query
      .groupBy('venta.ambienteId')
      .addGroupBy('ambiente.nombre')
      .addGroupBy('ambiente.tipo')
      .getRawMany()
    return ventas
  }

  getById = async (id: string) => {
    return await this.repository.findOne({
      relations: ['ambiente', 'usuario'],
      where: { id }
    })
  }

  update = async (id: string, data: Partial<Venta>) => {
    const venta = await this.repository.findOne({ where: { id } })

    if (!venta) return null

    // const ahora = DateHelper.getLocalDate()
    const ahora = new Date()

    if (data.tipo === TipoVenta.RESTANTE) {
      const {
        id,
        created_at: created_at,
        updated_at: updated_at,
        ...rest
      } = venta

      const nuevaVenta = this.repository.create({
        ...rest,
        tipo: data.tipo || venta.tipo,
        usuarioId: data.usuarioId || venta.usuarioId,
        created_at: ahora,
        updated_at: ahora
      })

      venta.tipo = TipoVenta.FINALIZADA
      venta.updated_at = ahora
      await this.repository.save(venta)

      return await this.repository.save(nuevaVenta)
    } else {
      const {
        ambiente,
        usuario,
        id,
        created_at,
        updated_at,
        deletedAt,
        ...camposLimpiados
      } = data

      Object.assign(venta, camposLimpiados)
      venta.updated_at = ahora

      return await this.repository.save(venta)
    }
  }

  delete = async (id: string) => {
    const venta = await this.repository.findOne({ where: { id } })
    if (!venta) return false
    await this.repository.save(venta)
    return true
  }

  getVentasByUsuario = async (
    fechaInicio: Date,
    fechaFin: Date,
    idUsuario: string
  ) => {
    return await this.repository
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.ambiente', 'ambiente')
      .where('venta.created_at BETWEEN :inicio AND :fin', {
        inicio: fechaInicio,
        fin: fechaFin
      })
      .andWhere('venta.usuarioId = :idUsuario', { idUsuario })
      .orderBy('venta.updated_at', 'ASC') // <-- Aquí agregamos el orden
      .getMany()
  }
}
