import { Router } from 'express'
import { ReporteController } from '../app/controllers'

const router = Router()

router.post('/diario', ReporteController.reporteDiarioUsuario)

export default router
