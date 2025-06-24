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
  hora_inicio: string

  @Column({ type: 'time' })
  hora_fin: string

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
    joinColumn: { name: 'evento_id' },
    inverseJoinColumn: { name: 'ambiente_id' }
  })
  ambientes: Ambiente[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at?: Date
}
