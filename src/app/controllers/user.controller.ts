import { Request, Response } from 'express'
import { UserService } from '../services/user.service'

const userService = new UserService()

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.create(req.body)
    res.status(201).json(user)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAll()
    res.json(users)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.getById(req.params.id)
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }
    res.json(user)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedUser = await userService.update(req.params.id, req.body)
    if (!updatedUser) {
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }
    res.json(updatedUser)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await userService.delete(req.params.id)
    if (!result) {
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }
    res.json({ message: 'Usuario eliminado' })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}
