import { Repository } from 'typeorm'
import { AppDataSource } from '../../config'
import { Categoria } from '../entities'

export class CategoriaRepository {
  private repository: Repository<Categoria>

  constructor() {
    this.repository = AppDataSource.getRepository(Categoria)
  }

  create = async (data: Partial<Categoria>) => {
    const categoria = this.repository.create(data)
    return await this.repository.save(categoria)
  }

  getAll = async () => {
    return await this.repository.find({ where: { isDeleted: false } })
  }

  getById = async (id: string) => {
    return await this.repository.findOne({ where: { id, isDeleted: false } })
  }

  update = async (id: string, data: Partial<Categoria>) => {
    const categoria = await this.repository.findOne({
      where: { id, isDeleted: false }
    })
    if (!categoria) return null
    Object.assign(categoria, data)
    return await this.repository.save(categoria)
  }

  delete = async (id: string) => {
    const categoria = await this.repository.findOne({ where: { id } })
    if (!categoria) return false
    categoria.isDeleted = true
    await this.repository.save(categoria)
    return true
  }
}
