import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'
import { Venta } from '.'

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ default: '' })
  nombreCliente: string

  @Column({ default: '' })
  celularCliente: string

  @OneToOne(() => Venta, (venta) => venta.reserva)
  @JoinColumn({ name: 'ventaId' })
  venta: Venta

  @Column({ type: 'uuid' })
  ventaId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date

}
