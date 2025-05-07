import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { EstadoAmbiente, TipoAmbiente } from '../dtos'
import { Categoria } from '.'

@Entity()
export class Ambiente {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: TipoAmbiente, default: TipoAmbiente.SAUNA })
  tipo: TipoAmbiente

  @Column({ default: '' })
  nombre: string

  @Column({
    type: 'enum',
    enum: EstadoAmbiente,
    default: EstadoAmbiente.DISPONIBLE
  })
  estado: EstadoAmbiente

  @Column('decimal', { default: 0.0 })
  precio: number

  @Column({ default: false })
  isDeleted: boolean

  @ManyToOne(() => Categoria)
  @JoinColumn({ name: 'categoriaId' })
  categoria: Categoria

  @Column({ type: 'uuid', nullable: true })
  categoriaId: string
}
