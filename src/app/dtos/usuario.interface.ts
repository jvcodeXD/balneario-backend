import { UserRole } from '.'

export interface UsuarioInterface {
  id: string
  username: string
  fullName: string
  role: UserRole
  picture: string
  password?: string
}
