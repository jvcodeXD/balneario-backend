import bcrypt from 'bcryptjs'
import { AppDataSource } from '../../config'
import { User } from '../entities/user.entity'
import { generateAccessToken, generateRefreshToken } from '../../utils'
import { UserRole } from '../dtos'

const userRepository = AppDataSource.getRepository(User)

export const register = async (
  username: string,
  pass: string,
  role: UserRole.USER
) => {
  const hashedPassword = await bcrypt.hash(pass, 10)
  const newUser = userRepository.create({
    username,
    password: hashedPassword,
    role
  })
  await userRepository.save(newUser)
  return newUser
}

export const login = async (username: string, pass: string) => {
  const existingUser = await userRepository.findOneBy({ username })
  if (!existingUser) throw new Error('Usuario no encontrado')

  const isMatch = await bcrypt.compare(pass, existingUser.password)
  if (!isMatch) throw new Error('Contraseña incorrecta')

  const accessToken = generateAccessToken(existingUser.id)
  const refreshToken = generateRefreshToken(existingUser.id)

  return { accessToken, refreshToken, user: existingUser }
}
