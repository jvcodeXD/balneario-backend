import { Repository } from "typeorm";
import { AppDataSource } from "../../config";
import { Venta } from "../entities";

export class VentaRepository {
    private repository: Repository<Venta>

    constructor(){
        this.repository = AppDataSource.getRepository(Venta)
    }

    create = async (data: Partial<Venta>) => {
        const venta = this.repository.create(data)
        return await this.repository.save(venta)
    }

    getAll = async () => {
        return await this.repository.find({
            relations: ['ambiente', 'user']
        })
    }

    getById = async (id: string) => {
        return await this.repository.findOne({
            relations: ['ambiente', 'user']
        })
    }

    update = async (id: string, data: Partial<Venta>) => {
        const venta = await this.repository.findOne({
          where: { id }
        })
        if (!venta) return null
        Object.assign(venta, data)
        return await this.repository.save(venta)
    }
    
      delete = async (id: string) => {
        const venta = await this.repository.findOne({ where: { id } })
        if (!venta) return false
        await this.repository.save(venta)
        return true
    }
}