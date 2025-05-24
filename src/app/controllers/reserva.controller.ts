import { Request, Response } from 'express'
import { ReservaService } from '../services'

const service = new ReservaService()

export const ReservaController = {
  create: async (req: Request, res: Response) => {
    try {
      const reserva = await service.create(req.body)
      res.status(201).json(reserva)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const reservas = await service.getAll()
      res.json(reservas)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const reserva = await service.getById(req.params.id)
      if (!reserva) {
        res.status(404).json({ error: 'Reserva no encontrado' })
        return
      }
      res.json(reserva)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const updated = await service.update(req.params.id, req.body)
      if (!updated) {
        res.status(404).json({ error: 'Reserva no encontrado' })
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
        res.status(404).json({ error: 'Reserva no encontrado' })
        return
      }
      res.json({ message: 'Reserva eliminado' })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
