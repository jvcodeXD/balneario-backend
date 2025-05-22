import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, } from 'typeorm'

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
}
