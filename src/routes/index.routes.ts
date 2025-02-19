import { Router } from 'express'
import { authRoutes } from '.'
import { uploadRoutes } from '.'
import { userRoutes } from '.'

const router = Router()

router.use('/auth', authRoutes)
router.use('/upload', uploadRoutes)
router.use('/users', userRoutes)

export default router
