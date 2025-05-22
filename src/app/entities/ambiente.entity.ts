import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'
import { EstadoAmbiente, TipoAmbiente } from '../dtos'
import { Precio } from '.'

@Entity()
export class Ambiente {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: TipoAmbiente, default: TipoAmbiente.SAUNA })
  tipo: TipoAmbiente

  @Column({ default: '' })
  nombre: string

  @Column({ type: 'enum', enum: EstadoAmbiente, default: EstadoAmbiente.DISPONIBLE })
  estadoAmbiente: EstadoAmbiente


  @ManyToOne(() => Precio, (precio) => precio.ambientes)
  @JoinColumn({ name: 'precioId' })
  precio: Precio

  @Column({ type: 'uuid', nullable: true })
  precioId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date

}
