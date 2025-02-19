import { Router } from 'express'
import { AuthController } from '../app/controllers'

const router = Router()

router.post('/register', AuthController.registerUser)
router.post('/login', AuthController.loginUser)
router.post('/refresh', AuthController.refreshAccessToken)
router.post('/logout', AuthController.logoutUser)

export default router
