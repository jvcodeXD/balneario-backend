import bcrypt from 'bcryptjs'
import { UserRepository } from '../repositories'
import { User } from '../entities/user.entity'
import { UserResponseDto } from '../response'

export class UserService {
  private userRepository: UserRepository
  private baseUrl: string

  constructor() {
    this.userRepository = new UserRepository()
    this.baseUrl = process.env.BASE_URL || 'http://localhost:4000'
  }

  create = async (userData: Partial<User>): Promise<User> => {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10)
    }
    const user = await this.userRepository.create(userData)
    return user
  }

  getAll = async (): Promise<UserResponseDto[]> => {
    const users = await this.userRepository.getAll()
    return users.map((user) => {
      const imageUrl = user.picture
        ? `${this.baseUrl}/uploads/${user.picture}`
        : undefined
      const { password, isDeleted, ...rest } = user
      return {
        ...rest,
        profileImageUrl: imageUrl
      }
    })
  }

  getById = async (id: string): Promise<UserResponseDto | null> => {
    const user = await this.userRepository.getById(id)
    if (!user) return null

    const imageUrl = user.picture
      ? `${this.baseUrl}/uploads/${user.picture}`
      : undefined
    const { password, ...rest } = user

    return {
      ...rest,
      profileImageUrl: imageUrl
    }
  }

  update = async (
    id: string,
    updateData: Partial<User>
  ): Promise<User | null> => {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10)
    }
    const updatedUser = await this.userRepository.update(id, updateData)
    return updatedUser
  }

  delete = async (id: string): Promise<boolean> => {
    return this.userRepository.delete(id)
  }
}
