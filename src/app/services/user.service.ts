import bcrypt from 'bcryptjs'
import { UserRepository } from '../repositories/user.repository'
import { User } from '../entities/user.entity'

export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  createUser = async (userData: Partial<User>): Promise<User> => {
    if (userData.pass) {
      userData.pass = await bcrypt.hash(userData.pass, 10)
    }
    return this.userRepository.createUser(userData)
  }

  getAllUsers = async (): Promise<User[]> => {
    return this.userRepository.getAllUsers()
  }

  getUserById = async (id: string): Promise<User | null> => {
    return this.userRepository.getUserById(id)
  }

  updateUser = async (
    id: string,
    updateData: Partial<User>
  ): Promise<User | null> => {
    if (updateData.pass) {
      updateData.pass = await bcrypt.hash(updateData.pass, 10)
    }
    return this.userRepository.updateUser(id, updateData)
  }

  deleteUser = async (id: string): Promise<boolean> => {
    return this.userRepository.deleteUser(id)
  }
}
