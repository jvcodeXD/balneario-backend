import { Request, Response } from "express";
import { PrecioService } from "../services";
import { logger } from "../../config";

const service = new PrecioService()

export const PrecioController = {
    create : async (req: Request, res: Response) => {
        try {
            logger.info(req.body)
            const precio = await service.create(req.body)
            res.status(201).json(precio)
        } catch(error : any){
            res.status(400).json({ error: error.message})
        }
    },
    
    getAll : async (req: Request, res: Response) => {
        try{
            const precio = await service.getAll()
            res.json(precio)
        }
        catch(error : any){
            res.status(400).json({error: error.message})
        }
    },

    getById : async (req: Request, res: Response) => {
        try {
            const precio = await service.getById(req.params.id)
            if(!precio){
                res.status(404).json({ error: 'Precio no encontrado'})
                return
            }
            res.json(precio)
        } catch (error : any) {
            res.status(400).json({ error: error.message})
        }
    },
    
    update: async (req: Request, res: Response) => {
        try {
          const precio = await service.update(req.params.id, req.body)
          if (!precio) {
            res.status(404).json({ error: 'Precio no encontrado' })
            return
          }
          res.json(precio)
        } catch (error: any) {
          res.status(400).json({ error: error.message })
        }
      },
    
      remove: async (req: Request, res: Response) => {
        try {
          const precio = await service.delete(req.params.id)
          if (!precio) {
            res.status(404).json({ error: 'Precio no encontrado' })
            return
          }
          res.json({ message: 'Precio eliminado' })
        } catch (error: any) {
          res.status(400).json({ error: error.message })
        }
      }
}