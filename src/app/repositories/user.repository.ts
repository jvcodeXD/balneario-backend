import { Repository } from 'typeorm'
import { AppDataSource } from '../../config'
import { User } from '../entities'

export class UserRepository {
  private repository: Repository<User>

  constructor() {
    this.repository = AppDataSource.getRepository(User)
  }

  create = async (userData: Partial<User>): Promise<User> => {
    const user = this.repository.create(userData)
    return await this.repository.save(user)
  }

  getAll = async (): Promise<User[]> => {
    return await this.repository.find({ where: { isDeleted: false } })
  }

  getById = async (id: string): Promise<User | null> => {
    return await this.repository.findOne({ where: { id, isDeleted: false } })
  }

  update = async (
    id: string,
    updateData: Partial<User>
  ): Promise<User | null> => {
    const user = await this.repository.findOne({
      where: { id, isDeleted: false }
    })
    if (!user) return null
    Object.assign(user, updateData)
    return await this.repository.save(user)
  }

  delete = async (id: string): Promise<boolean> => {
    const user = await this.repository.findOne({ where: { id } })
    if (!user) return false
    user.isDeleted = true
    await this.repository.save(user)
    return true
  }
}
