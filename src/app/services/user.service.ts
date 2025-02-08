import bcrypt from 'bcryptjs'
import { UserRepository } from '../repositories/user.repository'
import { User } from '../entities/user.entity'

export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  create = async (userData: Partial<User>): Promise<User> => {
    if (userData.pass) {
      userData.pass = await bcrypt.hash(userData.pass, 10)
    }
    return this.userRepository.create(userData)
  }

  getAll = async (): Promise<User[]> => {
    return this.userRepository.getAll()
  }

  getById = async (id: string): Promise<User | null> => {
    return this.userRepository.getById(id)
  }

  update = async (
    id: string,
    updateData: Partial<User>
  ): Promise<User | null> => {
    if (updateData.pass) {
      updateData.pass = await bcrypt.hash(updateData.pass, 10)
    }
    return this.userRepository.update(id, updateData)
  }

  delete = async (id: string): Promise<boolean> => {
    return this.userRepository.delete(id)
  }
}
