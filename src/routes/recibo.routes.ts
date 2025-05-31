import { Router } from 'express'
import { ReciboController } from '../app/controllers'

const router = Router()

router.get('/piscina', ReciboController.obtenerReciboPiscina)
router.get('/:id', ReciboController.obtenerRecibo)

export default router
