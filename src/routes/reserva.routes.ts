import { Router } from 'express'
import { ReservaController } from '../app/controllers'

const router = Router()

router.get('/', ReservaController.getAll)
router.get('/:id', ReservaController.getById)
router.post('/', ReservaController.create)
router.put('/:id', ReservaController.update)
router.delete('/:id', ReservaController.remove)

export default router