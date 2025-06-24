import { EstadoAmbiente } from './estado-ambiente.dto'
import { PrecioInterface } from './precio.interface'
import { TipoAmbiente } from './tipo-ambiente.dto'

export interface AmbienteInterface {
  id?: string
  tipo: TipoAmbiente
  estado: EstadoAmbiente
  nombre: string
  precio_id: string
  precio?: PrecioInterface
}
