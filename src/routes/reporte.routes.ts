import { Router } from 'express'
import { ReporteController } from '../app/controllers'

const router = Router()

router.post('/diario', ReporteController.reporteDiarioUsuario)
router.post('/diario/pdf', ReporteController.reporteDiarioUsuarioPDF)
router.post(
  '/ventas/tipo-ambiente',
  ReporteController.reporteVentasTipoAmbiente
)
router.post('/usuarios/', ReporteController.reporteIngresoUsuarios)

export default router
