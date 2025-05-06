import { Request, Response } from 'express'
import { CategoriaService } from '../services'

const service = new CategoriaService()

export const CategoriaController = {
  create: async (req: Request, res: Response) => {
    try {
      const categoria = await service.create(req.body)

      res.status(201).json(categoria)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const categorias = await service.getAll()
      res.json(categorias)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const categoria = await service.getById(req.params.id)
      if (!categoria) {
        res.status(404).json({ error: 'Categoria no encontrado' })
        return
      }
      res.json(categoria)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      const categoriaId = req.params.id

      const updatedCategoria = await service.update(categoriaId, req.body)

      if (!updatedCategoria) {
        res.status(404).json({ error: 'Categoria no encontrado' })
        return
      }

      res.json(updatedCategoria)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },
  remove: async (req: Request, res: Response) => {
    try {
      const result = await service.delete(req.params.id)
      if (!result) {
        res.status(404).json({ error: 'Categoria no encontrado' })
        return
      }
      res.json({ message: 'Categoria eliminado' })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
