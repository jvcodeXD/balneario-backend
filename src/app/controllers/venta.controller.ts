import { Request, Response } from 'express'
import { VentaService } from '../services'
import { TipoAmbiente } from '../dtos'

const service = new VentaService()

export const VentaController = {
  create: async (req: Request, res: Response) => {
    try {
      const venta = await service.create(req.body)
      console.log(venta)
      res.status(201).json(venta)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const filtros: any = {}
      if (req.query.fecha) filtros.fecha = req.query.fecha
      if (req.query.tipo) filtros.tipo = req.query.tipo
      const ventas = await service.getAll(filtros)
      res.json(ventas)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const venta = await service.getById(req.params.id)
      if (!venta) {
        res.status(404).json({ error: 'Venta no encontrado' })
        return
      }
      res.json(venta)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const updated = await service.update(req.params.id, req.body)
      if (!updated) {
        res.status(404).json({ error: 'Venta no encontrado' })
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
        res.status(404).json({ error: 'Venta no encontrado' })
        return
      }
      res.json({ message: 'Venta eliminado' })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  getVentasByFecha: async (req: Request, res: Response) => {
    try {
      const { fecha } = req.query
      if (!fecha) res.status(400).json({ error: 'Se requiere una fecha' })
      let tipo: TipoAmbiente | undefined = undefined
      if (req.query.tipo) tipo = req.query.tipo as TipoAmbiente
      const ventas = await service.getVentasByFecha(fecha as string, tipo)
      res.json(ventas)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
