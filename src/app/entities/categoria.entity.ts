import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Ambiente } from './ambiente.entity'

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  nombre: string

  @Column({ default: false })
  isDeleted: boolean

  
}
