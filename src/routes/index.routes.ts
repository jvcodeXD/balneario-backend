import { Router } from 'express'
import {
  ambienteRoutes,
  authRoutes,
  uploadRoutes,
  userRoutes,
  precioRoutes,
  ventaRoutes,
  reciboRoutes,
  eventoRoutes
} from '.'

const router = Router()

router.use('/auth', authRoutes)
router.use('/upload', uploadRoutes)
router.use('/users', userRoutes)
router.use('/ambiente', ambienteRoutes)
router.use('/precio', precioRoutes)
router.use('/venta', ventaRoutes)
router.use('/recibo', reciboRoutes)
router.use('/evento', eventoRoutes)

export default router
