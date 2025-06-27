import { Request, Response } from 'express'
import { ReporteService } from '../services'
import { logger } from '../../config'
import { reporteDiarioUsuarioPDF } from '../services/pdf.service'

const service = new ReporteService()

export const ReporteController = {
  reporteDiarioUsuario: async (req: Request, res: Response) => {
    try {
      logger.info(req.body)
      const { fecha_inicio, fecha_fin, usuario_id } = req.body
      const reporte = await service.reporteDiarioUsuario(
        fecha_inicio,
        fecha_fin,
        usuario_id
      )
      res.json(reporte)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  reporteDiarioUsuarioPDF: async (req: Request, res: Response) => {
    try {
      const { usuario_id, fecha_inicio, fecha_fin } = req.body
      service.reporteDiarioUsuarioPDF(res, fecha_inicio, fecha_fin, usuario_id)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  reporteVentasTipoAmbiente: async (req: Request, res: Response) => {
    try {
      const { fecha_inicio, fecha_fin } = req.body
      const ventas = await service.reporteVentasTipoAmbiente(
        fecha_inicio,
        fecha_fin
      )
      res.json(ventas)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  reporteIngresoUsuarios: async (req: Request, res: Response) => {
    try {
      const { fecha_inicio, fecha_fin } = req.body
      const reporte = await service.reporteIngresoUsuarios(
        fecha_inicio,
        fecha_fin
      )
      res.json(reporte)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  reporteIngresoUsuariosPDF: async (req: Request, res: Response) => {
    try {
      const { fecha_inicio, fecha_fin } = req.body
      service.reporteIngresoUsuariosPDF(res, fecha_inicio, fecha_fin)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
