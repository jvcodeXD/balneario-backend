import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { authRoutes } from './routes'
import { connectDB } from './config'
import dotenv from 'dotenv'
import 'reflect-metadata'

dotenv.config()

const PORT = process.env.PORT || 4000

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use('/auth', authRoutes)

connectDB()

app.listen(PORT, () => console.log('Server is running on port 4000'))
