import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { UserRole } from '../dtos'
import { Venta } from '.'

@Entity('user') // Nombre de tabla en snake_case
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole

  @Column({ name: 'fullname', default: '' })
  fullname: string

  @Column({ nullable: true })
  picture?: string

  @OneToMany(() => Venta, (venta) => venta.usuario)
  ventas: Venta[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date
}
