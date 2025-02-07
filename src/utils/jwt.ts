import jwt from 'jsonwebtoken'

const ACCESS_SECRET = process.env.ACCESS_SECRET || 'access_secret'
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret'

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: '15m' }) // Expira en 15 minutos
}

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' }) // Expira en 7 días
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET)
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET)
}
