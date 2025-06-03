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
  horaInicio: Date

  @Column({ type: 'timestamp' })
  horaFin: Date

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioTotal: number

  @Column({ type: 'int' })
  cantidad: number

  @Column({ default: '' })
  nombreCliente: string

  @Column({ default: '' })
  celularCliente: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuarioId' })
  usuario: User

  @Column({ type: 'uuid' })
  usuarioId: string

  @ManyToOne(() => Ambiente)
  @JoinColumn({ name: 'ambienteId' })
  ambiente: Ambiente

  @Column({ type: 'uuid' })
  ambienteId: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  adelanto: number

  @CreateDateColumn()
  fecha: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
