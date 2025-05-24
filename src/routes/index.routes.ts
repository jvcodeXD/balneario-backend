import { Router } from 'express'
import {
  ambienteRoutes,
  authRoutes,
  uploadRoutes,
  userRoutes,
  precioRoutes,
  ventaRoutes,
  reservaRoutes
} from '.'

const router = Router()

router.use('/auth', authRoutes)
router.use('/upload', uploadRoutes)
router.use('/users', userRoutes)
router.use('/ambiente', ambienteRoutes)
router.use('/precio',precioRoutes)
router.use('/venta',ventaRoutes)
router.use('/reserva',reservaRoutes)

export default router
