import { Request, Response } from 'express'

export const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No se ha subido ningún archivo' })
  }
  res.json({
    message: 'Archivo subido exitosamente',
    file: req.file ? req.file.filename : null
  })
}
