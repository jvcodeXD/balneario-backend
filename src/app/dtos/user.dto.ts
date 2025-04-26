import { UserRole } from '.'

export interface UserResponseDto {
  id: string
  user: string
  fullName: string
  role: UserRole
  picture?: string
  profileImageBase64?: string
}
