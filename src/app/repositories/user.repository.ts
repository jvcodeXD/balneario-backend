import { Repository } from 'typeorm'
import { AppDataSource } from '../../config'
import { User } from '../entities/user.entity'

export class UserRepository {
  private repository: Repository<User>

  constructor() {
    this.repository = AppDataSource.getRepository(User)
  }

  createUser = async (userData: Partial<User>): Promise<User> => {
    const user = this.repository.create(userData)
    return await this.repository.save(user)
  }

  getAllUsers = async (): Promise<User[]> => {
    return await this.repository.find({ where: { isDeleted: false } }) // Filtra eliminaciones lógicas
  }

  getUserById = async (id: string): Promise<User | null> => {
    return await this.repository.findOne({ where: { id, isDeleted: false } })
  }

  updateUser = async (
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

  deleteUser = async (id: string): Promise<boolean> => {
    const user = await this.repository.findOne({ where: { id } })
    if (!user) return false
    user.isDeleted = true
    await this.repository.save(user)
    return true
  }
}
