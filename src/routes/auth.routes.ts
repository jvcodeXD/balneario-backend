import { Router } from 'express'
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser
} from '../app/controllers'

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/refresh', refreshAccessToken)
router.post('/logout', logoutUser)

export default router
