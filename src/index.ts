import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

import { routes } from './routes'
import { connectDB } from './config'

dotenv.config()

const PORT = process.env.PORT || 4000

const app = express()

// Conectar a la base de datos ANTES de iniciar el servidor
connectDB()
  .then(() => {
    console.log('✅ Base de datos conectada con éxito')

    // Middlewares
    app.use(express.json())
    app.use(cors())
    app.use(cookieParser())

    // Servir archivos estáticos
    app.use('/uploads', express.static('uploads'))

    // Definir rutas principales
    app.use('/api', routes)

    // Iniciar el servidor
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('❌ Error al conectar a la base de datos:', err)
    process.exit(1) // Finaliza la ejecución si hay un error grave
  })
