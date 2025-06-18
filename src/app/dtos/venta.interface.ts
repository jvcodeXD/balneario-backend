import { AmbienteInterface } from '.'
import { TipoVenta } from './tipo-venta.dto'

export interface VentaInterface {
  id?: string
  hora_inicio: Date
  horaFin: Date
  precioTotal: number
  cantidad: number
  usuarioId: string
  ambienteId: string
  tipo: TipoVenta
  nombreCliente: string
  adelanto: number
  celularCliente?: string
  created_at?: Date
  updated_at?: Date
  menu?: boolean
  ambiente?: AmbienteInterface
}

export type CrearVentaInterface = Omit<VentaInterface, 'id' | 'fecha'>

export type UpdateVentaInterface = Partial<Omit<VentaInterface, 'fecha'>>
