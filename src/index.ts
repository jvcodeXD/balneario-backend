import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import path from 'path'

import routes from './routes/index.routes'
import { connectDB } from './config'

dotenv.config()

const PORT = process.env.PORT || 4000
const app = express()

connectDB()
  .then(() => {
    console.log('✅ Base de datos conectada con éxito')

    // Middlewares
    app.use(express.json())
    app.use(
      cors({
        origin: process.env.CLIENT_URL || 'http://localhost:3001',
        credentials: true
      })
    )
    app.use(cookieParser())

    // Servir archivos estáticos desde /uploads
    app.use(
      '/uploads',
      express.static(path.resolve(__dirname, '..', 'uploads'))
    )

    // Rutas
    app.use('/api', routes)

    // Middleware de errores globales (opcional)
    app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        console.error(err.stack)
        res.status(500).json({ error: 'Error interno del servidor' })
      }
    )

    // Iniciar servidor
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    )
  })
  .catch((err) => {
    console.error('❌ Error al conectar a la base de datos:', err)
    process.exit(1)
  })
