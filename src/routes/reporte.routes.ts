import { Router } from 'express'
import { ReporteController } from '../app/controllers'

const router = Router()

router.post('/diario', ReporteController.reporteDiarioUsuario)
router.post('/diario/pdf', ReporteController.reporteDiarioUsuarioPDF)
router.post(
  '/ventas/tipo-ambiente',
  ReporteController.reporteVentasTipoAmbiente
)
router.post('/usuarios', ReporteController.reporteIngresoUsuarios)
router.post('/usuarios/pdf', ReporteController.reporteIngresoUsuariosPDF)
router.post('/ambientes', ReporteController.reporteAmbientesUsados)

export default router
