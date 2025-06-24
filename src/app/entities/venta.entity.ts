import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm'
import { User, Ambiente } from '.'
import { TipoVenta } from '../dtos'
@Entity()
export class Venta {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: TipoVenta, default: TipoVenta.INMEDIATA })
  tipo: TipoVenta

  @Column({ type: 'timestamp' })
  hora_inicio: Date

  @Column({ type: 'timestamp' })
  hora_fin: Date

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_total: number

  @Column({ type: 'int' })
  cantidad: number

  @Column({ default: '' })
  nombre_cliente: string

  @Column({ default: '' })
  celular_cliente: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User

  @Column({ type: 'uuid' })
  usuario_id: string

  @ManyToOne(() => Ambiente)
  @JoinColumn({ name: 'ambiente_id' })
  ambiente?: Ambiente

  @Column({ type: 'uuid' })
  ambiente_id: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  adelanto: number

  @Column({ type: 'timestamp' })
  created_at: Date

  @Column({ type: 'timestamp' })
  updated_at: Date

  @DeleteDateColumn()
  deleted_at?: Date
}
