import { Repository, Not, In, LessThan, MoreThan, IsNull } from 'typeorm'
import { AppDataSource, logger } from '../../config'
import { Venta, User } from '../entities'
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

  getConflictos = async (ambiente_id: string, inicio: Date, fin: Date) => {
    return await this.repository.find({
      where: {
        ambiente_id,
        deleted_at: IsNull(),
        tipo: Not(In(['CANCELADA', 'FINALIZADA'])),
        hora_inicio: LessThan(fin),
        hora_fin: MoreThan(inicio)
      }
    })
  }

  getConflictosExcluyendoId = async (
    id: string,
    ambiente_id: string,
    hora_inicio: Date,
    hora_fin: Date
  ) => {
    return await this.repository.find({
      where: {
        id: Not(id),
        ambiente_id,
        deleted_at: IsNull(),
        tipo: Not(In(['CANCELADA', 'FINALIZADA'])),
        hora_inicio: LessThan(hora_fin),
        hora_fin: MoreThan(hora_inicio)
      }
    })
  }

  getAll = async (filtros: any) => {
    const query = this.repository
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.ambiente', 'ambiente')
      .leftJoinAndSelect('venta.usuario', 'usuario')
      .where('venta.deleted_at IS NULL')
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
      .select('venta.ambiente_id', 'ambiente_id')
      .addSelect('ambiente.nombre', 'nombre_ambiente')
      .addSelect('ambiente.tipo', 'tipo_ambiente')
      .addSelect('SUM(venta.cantidad)', 'cantidad')
      .where('venta.hora_inicio BETWEEN :inicio AND :fin', { inicio, fin })

    if (tipo) {
      query.andWhere('ambiente.tipo = :tipo', { tipo })
    }

    const ventas = await query
      .groupBy('venta.ambiente_id')
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
        usuario_id: data.usuario_id || venta.usuario_id,
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
        deleted_at,
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

  getVentasByUsuario = async (inicio: Date, fin: Date, usuario_id: string) => {
    console.log(inicio, fin)
    return await this.repository
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.ambiente', 'ambiente')
      .where('venta.created_at BETWEEN :inicio AND :fin', {
        inicio,
        fin
      })
      .andWhere('venta.usuario_id = :usuario_id', { usuario_id })
      .orderBy('venta.updated_at', 'ASC') // <-- Aquí agregamos el orden
      .getMany()
  }

  reporteVentasTipoAmbiente = async (fechaInicio: Date, fechaFin: Date) => {
    const result = await AppDataSource.getRepository(Venta)
      .createQueryBuilder('venta')
      .leftJoin('venta.ambiente', 'ambiente')
      .select([
        'DATE(venta.created_at) as fecha',
        'ambiente.tipo',
        `
      SUM(
        CASE
          WHEN venta.tipo = 'CANCELADA' THEN -COALESCE(venta.adelanto, 0)
          WHEN venta.tipo = 'RESERVADA' THEN COALESCE(venta.adelanto, 0)
          WHEN venta.tipo = 'FINALIZADA' THEN COALESCE(venta.adelanto, 0)
          WHEN venta.tipo = 'RESTANTE' THEN COALESCE(venta.precio_total, 0) - COALESCE(venta.adelanto, 0)
          ELSE COALESCE(venta.precio_total, 0)
        END
      ) as total
      `
      ])
      .where('venta.created_at BETWEEN :inicio AND :fin', {
        inicio: fechaInicio,
        fin: fechaFin
      })
      .groupBy('fecha')
      .addGroupBy('ambiente.tipo')
      .orderBy('fecha', 'ASC')
      .addOrderBy('ambiente.tipo', 'ASC')
      .getRawMany()

    // Reorganizar: Agrupar por fecha
    const agrupado: Record<string, { tipo: string; total: number }[]> = {}

    result.forEach((r) => {
      const fecha = r.fecha
      const tipo = r.ambiente_tipo
      const total = Number(r.total)

      if (!agrupado[fecha]) agrupado[fecha] = []
      agrupado[fecha].push({ tipo, total })
    })

    return agrupado
  }

  reporteVentasUsuario = async (fechaInicio: Date, fechaFin: Date) => {
    const repo = AppDataSource.getRepository(Venta)

    const ventas = await repo
      .createQueryBuilder('venta')
      .select(`DATE(venta.created_at)`, 'fecha')
      .addSelect('venta.usuario_id', 'usuario_id')
      .addSelect('user.fullname', 'fullname')
      .addSelect('SUM(venta.precio_total)', 'total_ventas')
      .addSelect('SUM(venta.cantidad)', 'cantidad_ventas')
      .innerJoin('user', 'user', 'user.id = venta.usuario_id')
      .where('venta.created_at BETWEEN :inicio AND :fin', {
        inicio: fechaInicio,
        fin: fechaFin
      })
      .andWhere('user.deleted_at IS NULL')
      .groupBy(`DATE(venta.created_at), venta.usuario_id, user.fullname`)
      .orderBy('fecha', 'ASC')
      .addOrderBy('total_ventas', 'DESC')
      .getRawMany()

    return ventas.map((v) => ({
      fecha: v.fecha,
      usuario_id: v.usuario_id,
      fullname: v.fullname,
      total_ventas: Number(v.total_ventas),
      cantidad_ventas: Number(v.cantidad_ventas)
    }))
  }

  reporteAmbientesUsados = async (fechaInicio: Date, fechaFin: Date) => {
    const repo = AppDataSource.getRepository(Venta)

    const resultado = await repo
      .createQueryBuilder('venta')
      .select('venta.ambiente_id', 'ambiente_id')
      .addSelect('ambiente.nombre', 'nombre')
      .addSelect('COUNT(venta.id)', 'total_ventas')
      .addSelect(
        'SUM(EXTRACT(EPOCH FROM (venta.hora_fin - venta.hora_inicio)) / 3600)',
        'total_horas'
      )
      .addSelect(
        `
      SUM(
        CASE
          WHEN venta.tipo = 'CANCELADA' THEN -venta.precio_total
          ELSE venta.precio_total
        END
      )
    `,
        'total_ingresos'
      )
      .innerJoin('ambiente', 'ambiente', 'ambiente.id = venta.ambiente_id')
      .where('venta.hora_inicio BETWEEN :inicio AND :fin', {
        inicio: fechaInicio,
        fin: fechaFin
      })
      .andWhere('ambiente.deleted_at IS NULL')
      .groupBy('venta.ambiente_id, ambiente.nombre')
      .orderBy('total_ingresos', 'DESC')
      .getRawMany()

    return resultado.map((r) => ({
      ambiente_id: r.ambiente_id,
      nombre: r.nombre,
      total_ventas: Number(r.total_ventas),
      total_horas: Number(r.total_horas) || 0,
      total_ingresos: Number(r.total_ingresos) || 0
    }))
  }
}
