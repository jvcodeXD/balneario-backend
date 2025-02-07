import { Router } from 'express'

import { authRoutes, uploadRoutes } from '.'

const router = Router()

router.use('/auth', authRoutes)
router.use('/upload', uploadRoutes)

export default router
