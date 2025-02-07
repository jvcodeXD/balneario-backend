import multer from 'multer'
import fs from 'fs'
import path from 'path'

// Ruta absoluta para la carpeta "uploads"
const uploadDir = path.resolve(__dirname, '../../uploads')

// Crear la carpeta "uploads" si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }) // Crea la carpeta si no existe
}

// Configurar almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir) // Guardar en la carpeta "uploads"
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`) // Nombre único
  }
})

// Filtrar tipos de archivos permitidos
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Tipo de archivo no permitido'), false)
  }
}

// Tamaño máximo de archivo: 5MB
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
})

export default upload
