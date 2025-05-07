import { Request, Response } from 'express'
import { AmbienteService } from '../services'

const service = new AmbienteService()

export const AmbienteController = {
  create: async (req: Request, res: Response) => {
    try {
      const ambiente = await service.create(req.body)
      res.status(201).json(ambiente)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const ambientes = await service.getAll()
      res.json(ambientes)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const ambiente = await service.getById(req.params.id)
      if (!ambiente) {
        res.status(404).json({ error: 'Ambiente no encontrado' })
        return
      }
      res.json(ambiente)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const updated = await service.update(req.params.id, req.body)
      if (!updated) {
        res.status(404).json({ error: 'Ambiente no encontrado' })
        return
      }
      res.json(updated)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  remove: async (req: Request, res: Response) => {
    try {
      const result = await service.delete(req.params.id)
      if (!result) {
        res.status(404).json({ error: 'Ambiente no encontrado' })
        return
      }
      res.json({ message: 'Ambiente eliminado' })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
