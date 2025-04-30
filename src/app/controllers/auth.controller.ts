import { Request, Response } from 'express'
import { logger } from '../../config'
import { register, login } from '../services/auth.service'
import { verifyRefreshToken, generateAccessToken } from '../../utils/'

export const AuthController = {
  registerUser: async (req: Request, res: Response) => {
    try {
      const { user, pass, rol } = req.body
      const newUser = await register(user, pass, rol)
      logger.info(`Usuario registrado: ${newUser.username}`)
      res.status(201).json(newUser)
    } catch (error: any) {
      logger.error(`Error al registrar usuario: ${error.message}`)
      res.status(400).json({ error: error.message })
    }
  },
  loginUser: async (req: Request, res: Response) => {
    try {
      const { username, pass } = req.body
      const {
        accessToken,
        refreshToken,
        user: userData
      } = await login(username, pass)

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      })
      logger.info(`Usuario logueado: ${userData.username}`)
      res.json({ accessToken, user: userData })
    } catch (error: any) {
      logger.error(`Error al loguear usuario: ${error.message}`)
      res.status(400).json({ error: error.message })
    }
  },
  refreshAccessToken: async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refreshToken
      if (!refreshToken) {
        logger.error('No hay refresh token')
        res.status(401).json({ error: 'No hay refresh token' })
      }
      const decoded: any = verifyRefreshToken(refreshToken)
      const newAccessToken = generateAccessToken(decoded.id)
      logger.info(`Token de acceso renovado para el usuario: ${decoded.user}`)
      res.json({ accessToken: newAccessToken })
    } catch (error: any) {
      logger.error(`Error al renovar el token de acceso: ${error.message}`)
      res.status(403).json({ error: 'Token inválido o expirado' })
    }
  },
  logoutUser: (req: Request, res: Response) => {
    res.clearCookie('refreshToken')
    logger.info('Sesión cerrada correctamente')
    res.json({ message: 'Sesión cerrada correctamente' })
  }
}
