import { Router } from 'express'
import { AmbienteController } from '../app/controllers'

const router = Router()

router.get('/', AmbienteController.getAll)
router.get('/:id', AmbienteController.getById)
router.post('/', AmbienteController.create)
router.put('/:id', AmbienteController.update)
router.delete('/:id', AmbienteController.remove)

export default router
