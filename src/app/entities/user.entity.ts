import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { UserRole } from '../dtos'
import { Venta } from '.'

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

  @OneToMany(() => Venta, (venta) => venta.usuario)
  ventas: Venta[]
}
