import { UserRole } from '../dtos'

export interface UserResponseDto {
  id: string
  username: string
  role: UserRole
  fullName: string
  profileImageUrl?: string
}
