import { Repository } from "typeorm";
import { AppDataSource } from '../../config'
import { Precio } from "../entities";

export class PrecioRepository {
    private repository : Repository <Precio>

    constructor(){
        this.repository = AppDataSource.getRepository(Precio)
    }

    create = async ( data : Partial <Precio>) => {
        const precio = this.repository.create(data)
        return await this.repository.save(precio)
    }

    getAll = async () => {
        return await this.repository.find()
    }

    getById = async (id: string) => {
        return await this.repository.findOne({
          where: { id }
        })
    }

    update = async (id: string, data: Partial<Precio>) => {
        const precio = await this.getById(id)
        if (!precio) return null
        Object.assign(precio, data)
        return await this.repository.save(precio)
    }

    delete = async (id: string) => {
        const precio = await this.getById(id)
        if (!precio) return false
        await this.repository.softRemove(precio)
        return true
    }
}