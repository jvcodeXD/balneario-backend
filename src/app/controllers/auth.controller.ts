import { Request, Response } from 'express'
import { register, login } from '../services/auth.service'
import { verifyRefreshToken, generateAccessToken } from '../../utils/'

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { user, pass, rol } = req.body
    const newUser = await register(user, pass, rol)
    res.status(201).json(newUser)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { user, pass } = req.body
    const {
      accessToken,
      refreshToken,
      user: userData
    } = await login(user, pass)

    // Guardamos el refresh token en una cookie httpOnly
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    })
    res.json({ accessToken, user: userData })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

// 🔄 Ruta para renovar el token de acceso con el refresh token
export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) res.status(401).json({ error: 'No hay refresh token' })

    const decoded: any = verifyRefreshToken(refreshToken)
    const newAccessToken = generateAccessToken(decoded.id)

    res.json({ accessToken: newAccessToken })
  } catch (error: any) {
    res.status(403).json({ error: 'Token inválido o expirado' })
  }
}

// 🚪 Logout: Borrar la cookie del refresh token
export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie('refreshToken')
  res.json({ message: 'Sesión cerrada correctamente' })
}
