import { Router } from 'express'
import { AmbienteController } from '../app/controllers'

const router = Router()

router.get('/', AmbienteController.getAll)
router.post('/', AmbienteController.create)
router.put('/:id', AmbienteController.update)
router.delete('/:id', AmbienteController.remove)
router.get('/:id', AmbienteController.getById)

export default router
