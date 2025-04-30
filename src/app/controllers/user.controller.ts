import { Request, Response } from 'express'
import { UserService } from '../services'
import { upload } from '../../middlewares'
import { renameProfileImage } from '../services/helper.service'
import { UserResponseDto } from '../response'

const service = new UserService()

export const UserController = {
  create: [
    upload.single('picture'),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const user = await service.create(req.body)

        if (req.file) {
          const renamedPath = renameProfileImage(req.file.filename, user.id)
          await service.update(user.id, { picture: renamedPath })
          user.picture = renamedPath
        }

        res.status(201).json(user)
      } catch (error: any) {
        res.status(400).json({ error: error.message })
      }
    }
  ],
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const users: UserResponseDto[] = await service.getAll()
      res.json(users)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const user: UserResponseDto | null = await service.getById(req.params.id)
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' })
        return
      }
      res.json(user)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },
  update: [
    upload.single('picture'),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.params.id

        // Si hay una imagen nueva, la renombramos antes de guardar
        if (req.file) {
          const renamedPath = renameProfileImage(req.file.filename, userId)
          req.body.picture = renamedPath
        }

        const updatedUser = await service.update(userId, req.body)

        if (!updatedUser) {
          res.status(404).json({ error: 'Usuario no encontrado' })
          return
        }

        res.json(updatedUser)
      } catch (error: any) {
        res.status(400).json({ error: error.message })
      }
    }
  ],

  remove: async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await service.delete(req.params.id)
      if (!result) {
        res.status(404).json({ error: 'Usuario no encontrado' })
        return
      }
      res.json({ message: 'Usuario eliminado' })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
