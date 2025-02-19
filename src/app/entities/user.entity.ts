import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  user: string

  @Column()
  password: string

  @Column({ default: 'user' })
  rol: string

  @Column({ default: '' })
  fullName: string

  @Column({ default: false })
  isDeleted: boolean
}
