import { Request, Response } from 'express'
import { logger } from '../../config'

export const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    logger.error('No se ha subido ningún archivo')
    res.status(400).json({ error: 'No se ha subido ningún archivo' })
  }
  logger.info(`Archivo subido: ${req.file!.filename}`)
  res.json({
    message: 'Archivo subido exitosamente',
    file: req.file ? req.file.filename : null
  })
}
