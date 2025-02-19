import { Request, Response } from 'express'
import { UserService } from '../services'

const service = new UserService()

export const UserController = {
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await service.create(req.body)
      res.status(201).json(user)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await service.getAll()
      res.json(users)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await service.getById(req.params.id)
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' })
        return
      }
      res.json(user)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedUser = await service.update(req.params.id, req.body)
      if (!updatedUser) {
        res.status(404).json({ error: 'Usuario no encontrado' })
        return
      }
      res.json(updatedUser)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },
  remove: async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await service.delete(req.params.id)
      if (!result) {
        res.status(404).json({ error: 'Usuario no encontrado' })
        return
      }
      res.json({ message: 'Usuario eliminado' })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
