import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../app/entities'
import logger from './logger'
import dotenv from 'dotenv'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'testdb',
  synchronize: true,
  logging: false,
  entities: [User]
})

export const connectDB = async () => {
  try {
    await AppDataSource.initialize()
  } catch (error) {
    logger.error('❌ Error al conectar la BD:', error)
  }
}
