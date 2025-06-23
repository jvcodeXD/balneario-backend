import { Router } from 'express'
import { ReporteController } from '../app/controllers'

const router = Router()

router.post('/diario', ReporteController.reporteDiarioUsuario)
router.post('/diario/pdf', ReporteController.reporteDiarioUsuarioPDF)
router.post(
  '/ventas/tipo-ambiente',
  ReporteController.reporteVentasTipoAmbiente
)

export default router
