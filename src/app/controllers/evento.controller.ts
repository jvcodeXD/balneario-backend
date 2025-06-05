import { Request, Response } from 'express'
import { EventoService } from '../services'
import { logger } from '../../config'

const service = new EventoService()

export const EventoController = {
  create: async (req: Request, res: Response) => {
    try {
      logger.info(req.body)
      const evento = await service.create(req.body)
      res.status(201).json(evento)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  getAll: async (_req: Request, res: Response) => {
    try {
      const eventos = await service.getAll()
      res.json(eventos)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const evento = await service.getById(req.params.id)
      if (!evento) {
        res.status(404).json({ error: 'Evento no encontrado' })
        return
      }
      res.json(evento)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const evento = await service.update(req.params.id, req.body)
      if (!evento) {
        res.status(404).json({ error: 'Evento no encontrado' })
        return
      }
      res.json(evento)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  remove: async (req: Request, res: Response) => {
    try {
      const evento = await service.delete(req.params.id)
      if (!evento) {
        res.status(404).json({ error: 'Evento no encontrado' })
        return
      }
      res.json({ message: 'Evento eliminado' })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
