import { Repository, Between } from 'typeorm'
import { AppDataSource } from '../../config'
import { Venta } from '../entities'
import { TipoAmbiente } from '../dtos'

export class VentaRepository {
  private repository: Repository<Venta>

  constructor() {
    this.repository = AppDataSource.getRepository(Venta)
  }

  create = async (data: Partial<Venta>) => {
    const venta = this.repository.create(data)
    return await this.repository.save(venta)
  }

  getAll = async () => {
    return await this.repository.find({
      relations: ['ambiente', 'usuario']
    })
  }

  getVentasByFecha = async (fecha: string, tipo?: TipoAmbiente) => {
    const inicio = new Date(`${fecha} 00:00:00`)
    const fin = new Date(`${fecha} 23:59:59`)
    console.log(inicio, fin)
    const query = this.repository
      .createQueryBuilder('venta')
      .leftJoin('venta.ambiente', 'ambiente')
      .select('venta.ambienteId', 'ambienteId')
      .addSelect('ambiente.nombre', 'nombreAmbiente')
      .addSelect('ambiente.tipo', 'tipoAmbiente')
      .addSelect('SUM(venta.cantidad)', 'cantidad')
      .where('venta.horaInicio BETWEEN :inicio AND :fin', { inicio, fin })

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
    const venta = await this.repository.findOne({
      where: { id }
    })
    if (!venta) return null
    Object.assign(venta, data)
    return await this.repository.save(venta)
  }

  delete = async (id: string) => {
    const venta = await this.repository.findOne({ where: { id } })
    if (!venta) return false
    await this.repository.save(venta)
    return true
  }
}
