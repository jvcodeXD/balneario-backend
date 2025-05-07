import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { UserRole } from '../dtos'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole

  @Column({ default: '' })
  fullName: string

  @Column({ nullable: true })
  picture?: string

  @Column({ default: false })
  isDeleted: boolean
}
