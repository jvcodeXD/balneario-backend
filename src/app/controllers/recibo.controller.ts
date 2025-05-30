import { Request, Response } from 'express'
import { generarReciboPDF } from '../services'

export const ReciboController = {
  obtenerRecibo: (req: Request, res: Response) => {
    try {
      const ventaId = req.params.id
      if (!ventaId) {
        res.status(400).json({ error: 'ID de venta no proporcionado' })
      }

      generarReciboPDF(res, ventaId)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
