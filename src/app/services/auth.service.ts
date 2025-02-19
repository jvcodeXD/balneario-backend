import bcrypt from 'bcryptjs'
import { AppDataSource } from '../../config'
import { User } from '../entities/user.entity'
import { generateAccessToken, generateRefreshToken } from '../../utils'

const userRepository = AppDataSource.getRepository(User)

export const register = async (
  user: string,
  pass: string,
  rol: string = 'user'
) => {
  const hashedPassword = await bcrypt.hash(pass, 10)
  const newUser = userRepository.create({ user, password: hashedPassword, rol })
  await userRepository.save(newUser)
  return newUser
}

export const login = async (user: string, pass: string) => {
  const existingUser = await userRepository.findOneBy({ user })
  if (!existingUser) throw new Error('Usuario no encontrado')

  const isMatch = await bcrypt.compare(pass, existingUser.password)
  if (!isMatch) throw new Error('Contraseña incorrecta')

  const accessToken = generateAccessToken(existingUser.id)
  const refreshToken = generateRefreshToken(existingUser.id)

  return { accessToken, refreshToken, user: existingUser }
}
