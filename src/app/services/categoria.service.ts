import { CategoriaRepository } from '../repositories'
import { Categoria } from '../entities'

export class CategoriaService {
  private categoriaRepository: CategoriaRepository

  constructor() {
    this.categoriaRepository = new CategoriaRepository()
  }

  create = async (data: Categoria) => {
    return await this.categoriaRepository.create(data)
  }

  getAll = async () => {
    return await this.categoriaRepository.getAll()
  }

  getById = async (id: string) => {
    const categoria = await this.categoriaRepository.getById(id)
    if (!categoria) return null

    return categoria
  }

  update = async (id: string, data: Partial<Categoria>) => {
    return await this.categoriaRepository.update(id, data)
  }

  delete = async (id: string) => {
    return this.categoriaRepository.delete(id)
  }

  existe = async (nombre: string) => {
    return await this.categoriaRepository.existe(nombre)
  }
}
