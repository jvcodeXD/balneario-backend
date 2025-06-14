import { Request, Response } from 'express'
import { ReporteService } from '../services'
import { logger } from '../../config'

const service = new ReporteService()

export const ReporteController = {
  reporteDiarioUsuario: async (req: Request, res: Response) => {
    try {
      logger.info(req.body)
      const { fechaInicio, fechaFin, idUsuario } = req.body
      const reporte = await service.reporteDiarioUsuario(
        fechaInicio,
        fechaFin,
        idUsuario
      )
      res.json(reporte)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
