import { Router } from 'express'
import { UserController } from '../app/controllers'

const router = Router()

router.post('/', UserController.create)
router.get('/', UserController.getAll)
router.get('/:id', UserController.getById)
router.put('/:id', UserController.update)
router.delete('/:id', UserController.remove)

export default router
