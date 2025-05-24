import 'reflect-metadata'
import { DataSource } from 'typeorm'
import logger from './logger'
import dotenv from 'dotenv'
import { User, Ambiente, Precio, Venta, Reserva } from '../app/entities'

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
  entities: [User, Ambiente, Precio, Venta, Reserva]
})

export const connectDB = async () => {
  try {
    await AppDataSource.initialize()
  } catch (error) {
    logger.error('❌ Error al conectar la BD:', error)
  }
}
