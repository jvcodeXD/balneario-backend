import { AmbienteInterface } from '.'
import { TipoVenta } from './tipo-venta.dto'

export interface VentaInterface {
  id?: string
  hora_inicio: Date
  hora_fin: Date
  precio_total: number
  cantidad: number
  usuario_id: string
  ambiente_id: string
  tipo: TipoVenta
  nombre_cliente: string
  adelanto: number
  celular_cliente?: string
  created_at?: Date
  updated_at?: Date
  menu?: boolean
  ambiente?: AmbienteInterface
}

export type CrearVentaInterface = Omit<VentaInterface, 'id' | 'fecha'>

export type UpdateVentaInterface = Partial<Omit<VentaInterface, 'fecha'>>
