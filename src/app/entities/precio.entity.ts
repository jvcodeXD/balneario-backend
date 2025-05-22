import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm'
import { Ambiente } from '.'


@Entity()
export class Precio {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ default: '' })
  tipo: string

  @Column('decimal', { precision: 10, scale: 2 , default: 0 })
  precio: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date

  @OneToMany(() => Ambiente, (ambiente) => ambiente.precio)
  ambientes: Ambiente[]

}
