import { Router } from 'express'
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../app/controllers'

const router = Router()

// Crear un nuevo usuario
router.post('/', createUser)

// Obtener todos los usuarios
router.get('/', getAllUsers)

// Obtener un usuario por ID
router.get('/:id', getUserById)

// Actualizar un usuario por ID
router.put('/:id', updateUser)

// Eliminar un usuario por ID
router.delete('/:id', deleteUser)

export default router
