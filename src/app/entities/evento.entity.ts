import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm'
import { Ambiente } from './ambiente.entity'
import { TipoEvento } from '../dtos'

@Entity()
export class Evento {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  nombre: string

  @Column({ nullable: true })
  descripcion: string

  @Column({ type: 'date', nullable: true })
  fecha: Date // Solo para tipo UNICO

  @Column({ type: 'time' })
  horaInicio: string

  @Column({ type: 'time' })
  horaFin: string

  @Column({
    type: 'enum',
    enum: TipoEvento,
    default: TipoEvento.UNICO
  })
  tipo: TipoEvento

  @Column({ default: true })
  activo: boolean

  @ManyToMany(() => Ambiente)
  @JoinTable({
    name: 'evento_ambiente',
    joinColumn: { name: 'eventoId' },
    inverseJoinColumn: { name: 'ambienteId' }
  })
  ambientes: Ambiente[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
