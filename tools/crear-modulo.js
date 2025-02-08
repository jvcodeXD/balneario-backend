const fs = require('fs')
const path = require('path')

let moduleName = process.argv[2]
if (!moduleName) {
  console.error('Por favor, proporciona un nombre de módulo.')
  process.exit(1)
}

const formatModuleName = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
moduleName = formatModuleName(moduleName)
const moduleLower = moduleName.toLowerCase()

const baseDir = path.join(__dirname, '../src/app')
const routesDir = path.join(__dirname, '../src/routes')
const indexRoutesPath = path.join(routesDir, 'index.ts')

// Contenido de los archivos generados
const entityContent = `import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class ${moduleName} {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ default: false })
  isDeleted: boolean
}`

const repositoryContent = `import { Repository } from 'typeorm'
import { AppDataSource } from '../../config'
import { ${moduleName} } from '../entities/${moduleLower}.entity'

export class ${moduleName}Repository {
  private repository: Repository<${moduleName}>

  constructor() {
    this.repository = AppDataSource.getRepository(${moduleName})
  }

  create = async (data: Partial<${moduleName}>): Promise<${moduleName}> => {
    const ${moduleLower} = this.repository.create(data)
    return await this.repository.save(${moduleLower})
  }

  getAll = async (): Promise<${moduleName}[]> => {
    return await this.repository.find({ where: { isDeleted: false } })
  }

  getById = async (id: string): Promise<${moduleName} | null> => {
    return await this.repository.findOne({ where: { id, isDeleted: false } })
  }

  update = async (id: string, data: Partial<${moduleName}>): Promise<${moduleName} | null> => {
    const ${moduleLower} = await this.repository.findOne({ where: { id, isDeleted: false } })
    if (!${moduleLower}) return null
    Object.assign(${moduleLower}, data)
    return await this.repository.save(${moduleLower})
  }

  delete = async (id: string): Promise<boolean> => {
    const ${moduleLower} = await this.repository.findOne({ where: { id } })
    if (!${moduleLower}) return false
    ${moduleLower}.isDeleted = true
    await this.repository.save(${moduleLower})
    return true
  }
}`

const serviceContent = `import { ${moduleName}Repository } from '../repositories/${moduleLower}.repository'
import { ${moduleName} } from '../entities/${moduleLower}.entity'

export class ${moduleName}Service {
  private repository: ${moduleName}Repository

  constructor() {
    this.repository = new ${moduleName}Repository()
  }

  create = async (data: Partial<${moduleName}>): Promise<${moduleName}> => {
    return this.repository.create(data)
  }

  getAll = async (): Promise<${moduleName}[]> => {
    return this.repository.getAll()
  }

  getById = async (id: string): Promise<${moduleName} | null> => {
    return this.repository.getById(id)
  }

  update = async (id: string, data: Partial<${moduleName}>): Promise<${moduleName} | null> => {
    return this.repository.update(id, data)
  }

  delete = async (id: string): Promise<boolean> => {
    return this.repository.delete(id)
  }
}`

const controllerContent = `import { Request, Response } from 'express'
import { ${moduleName}Service } from '../services/${moduleLower}.service'

const service = new ${moduleName}Service()

export const create = async (req: Request, res: Response) => {
  try {
    const ${moduleLower} = await service.create(req.body)
    res.status(201).json(${moduleLower})
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const getAll = async (req: Request, res: Response) => {
  try {
    const ${moduleLower}s = await service.getAll()
    res.json(${moduleLower}s)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const getById = async (req: Request, res: Response) => {
  try {
    const ${moduleLower} = await service.getById(req.params.id)
    if (!${moduleLower}) {
      res.status(404).json({ error: '${moduleName} no encontrado' })
      return
    }
    res.json(${moduleLower})
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const update = async (req: Request, res: Response) => {
  try {
    const ${moduleLower} = await service.update(req.params.id, req.body)
    if (!${moduleLower}) {
      res.status(404).json({ error: '${moduleName} no encontrado' })
      return 
    }
    res.json(${moduleLower})
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await service.delete(req.params.id)
    if (!result) {
      res.status(404).json({ error: '${moduleName} no encontrado' })
      return 
    }
    res.json({ message: '${moduleName} eliminado' })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}`

const routeContent = `import { Router } from 'express'
import { create, getAll, getById, update, remove } from '../app/controllers'

const router = Router()

router.post('/', create)
router.get('/', getAll)
router.get('/:id', getById)
router.put('/:id', update)
router.delete('/:id', remove)

export default router`

// Función para escribir archivos
const writeFile = (dir, filename, content) => {
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, filename), content)
}

// Crear archivos
writeFile(`${baseDir}/entities`, `${moduleLower}.entity.ts`, entityContent)
writeFile(
  `${baseDir}/repositories`,
  `${moduleLower}.repository.ts`,
  repositoryContent
)
writeFile(`${baseDir}/services`, `${moduleLower}.service.ts`, serviceContent)
writeFile(
  `${baseDir}/controllers`,
  `${moduleLower}.controller.ts`,
  controllerContent
)
writeFile(routesDir, `${moduleLower}.routes.ts`, routeContent)

// Actualizar archivos de barril en cada carpeta
const updateBarrelFile = (dir, exportStatement) => {
  const indexPath = path.join(dir, 'index.ts')
  let content = ''
  if (fs.existsSync(indexPath)) {
    content = fs.readFileSync(indexPath, 'utf8')
  }
  if (!content.includes(exportStatement)) {
    content += `\n${exportStatement}`
    fs.writeFileSync(indexPath, content)
  }
}

updateBarrelFile(
  `${baseDir}/entities`,
  `export { ${moduleName} } from './${moduleLower}.entity'\n`
)
updateBarrelFile(
  `${baseDir}/repositories`,
  `export { ${moduleName}Repository } from './${moduleLower}.repository'\n`
)
updateBarrelFile(
  `${baseDir}/services`,
  `export { ${moduleName}Service } from './${moduleLower}.service'\n`
)
updateBarrelFile(
  `${baseDir}/controllers`,
  `export * from './${moduleLower}.controller'\n`
)

// Agregar la ruta al index de routes
updateBarrelFile(
  routesDir,
  `export { default as ${moduleLower}Routes } from './${moduleLower}.routes'`
)

// Actualizar el archivo index.routes.ts con la nueva ruta
const updateMainRoutesFile = () => {
  let content = fs.readFileSync(indexRoutesPath, 'utf8')

  // Verificar si la ruta ya está incluida
  if (!content.includes(`${moduleLower}Routes`)) {
    // Encontrar la línea antes de "export default router"
    const exportIndex = content.lastIndexOf('export default router')

    // Insertar la ruta antes de "export default router"
    content =
      content.slice(0, exportIndex) +
      `\nrouter.use('/${moduleLower}', ${moduleLower}Routes)` +
      content.slice(exportIndex)

    // Escribir de nuevo el contenido actualizado
    fs.writeFileSync(indexRoutesPath, content)
  }
}

updateMainRoutesFile()

console.log(`Módulo ${moduleName} generado exitosamente.`)
