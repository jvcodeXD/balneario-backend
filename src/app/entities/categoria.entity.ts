import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  nombre: string

  @Column({ default: false })
  isDeleted: boolean
}
