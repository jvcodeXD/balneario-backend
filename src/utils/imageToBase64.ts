import fs from 'fs'
import path from 'path'

const uploadDir = path.resolve(__dirname, '../../../uploads')

export const imageToBase64 = (fileName: string): string | null => {
  const filePath = path.join(uploadDir, fileName)
  if (!fs.existsSync(filePath)) return null

  const buffer = fs.readFileSync(filePath)
  const ext = path.extname(fileName).toLowerCase()
  const mimeType =
    ext === '.png'
      ? 'image/png'
      : ext === '.jpg' || ext === '.jpeg'
      ? 'image/jpeg'
      : 'application/octet-stream'

  return `data:${mimeType};base64,${buffer.toString('base64')}`
}
