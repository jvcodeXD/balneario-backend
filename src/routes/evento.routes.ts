import { Router } from 'express'
import { EventoController } from '../app/controllers'

const router = Router()

router.get('/', EventoController.getAll)
router.post('/', EventoController.create)
router.get('/:id', EventoController.getById)
router.put('/:id', EventoController.update)
router.delete('/:id', EventoController.remove)

export default router
