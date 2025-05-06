import { Router } from 'express'
import { CategoriaController } from '../app/controllers'

const router = Router()

router.post('/', CategoriaController.create)
router.get('/', CategoriaController.getAll)
router.get('/:id', CategoriaController.getById)
router.put('/:id', CategoriaController.update)
router.delete('/:id', CategoriaController.remove)

export default router
