import { Request, Response } from 'express'
import { generarReciboPDF, generarReciboPiscina } from '../services'

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
  },
  obtenerReciboPiscina: (req: Request, res: Response) => {
    try {
      const { ninos, adultos, usuarioId, precioNino, precioAdulto } = req.query
      generarReciboPiscina(
        res,
        Number(ninos),
        Number(adultos),
        String(usuarioId),
        String(precioNino),
        String(precioAdulto)
      )
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
