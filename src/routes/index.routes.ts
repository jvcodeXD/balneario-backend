import { Router } from 'express'
import {
  ambienteRoutes,
  authRoutes,
  categoriaRoutes,
  uploadRoutes,
  userRoutes,
  precioRoutes
} from '.'

const router = Router()

router.use('/auth', authRoutes)
router.use('/upload', uploadRoutes)
router.use('/users', userRoutes)
router.use('/categoria', categoriaRoutes)
router.use('/ambiente', ambienteRoutes)
router.use('/precio',precioRoutes)

export default router
