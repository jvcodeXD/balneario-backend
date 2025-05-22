import { Router } from 'express'
import { PrecioController } from '../app/controllers'

const router = Router()

router.get('/', PrecioController.getAll)
router.get('/:id', PrecioController.getById)
router.post('/', PrecioController.create)
router.put('/:id', PrecioController.update)
router.delete('/:id', PrecioController.remove)

export default router