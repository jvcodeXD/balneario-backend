import { Router } from 'express'
import {
  ambienteRoutes,
  authRoutes,
  categoriaRoutes,
  uploadRoutes,
  userRoutes
} from '.'

const router = Router()

router.use('/auth', authRoutes)
router.use('/upload', uploadRoutes)
router.use('/users', userRoutes)
router.use('/categoria', categoriaRoutes)
router.use('/ambiente', ambienteRoutes)

export default router
