import { Router } from 'express'
import { upload } from '../middlewares'
import { uploadFile } from '../app/controllers'

const router = Router()

// Subir un solo archivo
router.post('', upload.single('file'), uploadFile)

export default router
