import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from "typeorm";
import { User, Ambiente, Reserva } from '.'
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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuarioId' })
  usuario: User

  @Column({ type: 'uuid' })
  usuarioId: string

  @ManyToOne(() => Ambiente)
  @JoinColumn({ name: 'ambienteId' })
  ambiente: Ambiente

  @OneToOne(() => Reserva, (reserva) => reserva.venta, { nullable: true })
  reserva?: Reserva

  @Column({ type: 'uuid' })
  ambienteId: string

  @CreateDateColumn()
  fecha: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}