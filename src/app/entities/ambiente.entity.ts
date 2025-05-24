import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'
import { EstadoAmbiente, TipoAmbiente } from '../dtos'
import { Precio, Venta } from '.'

@Entity()
export class Ambiente {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: TipoAmbiente, default: TipoAmbiente.SAUNA })
  tipo: TipoAmbiente

  @Column({ default: '' })
  nombre: string

  @Column({ type: 'enum', enum: EstadoAmbiente, default: EstadoAmbiente.HABILITADO })
  estado: EstadoAmbiente


  @ManyToOne(() => Precio, (precio) => precio.ambientes)
  @JoinColumn({ name: 'precioId' })
  precio: Precio

  @Column({ type: 'uuid', nullable: true })
  precioId: string

  @OneToMany(() => Venta, (venta) => venta.ambiente)
  ventas: Venta[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date

}
