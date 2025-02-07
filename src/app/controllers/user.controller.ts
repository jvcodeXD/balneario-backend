import { Request, Response } from 'express'
import { UserService } from '../services/user.service'

const userService = new UserService()

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await userService.createUser(req.body)
    res.status(201).json(user)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await userService.getAllUsers()
    res.json(users)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params.id)
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }
    res.json(user)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body)
    if (!updatedUser) {
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }
    res.json(updatedUser)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await userService.deleteUser(req.params.id)
    if (!result) {
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }
    res.json({ message: 'Usuario eliminado' })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}
