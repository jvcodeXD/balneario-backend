import fs from 'fs'
import path from 'path'

const uploadDir = path.resolve(__dirname, '../../../uploads')

export const renameProfileImage = (
  tempFileName: string,
  userId: string
): string => {
  const ext = path.extname(tempFileName)
  const newFileName = `perfil-${userId}${ext}`
  const tempPath = path.join(uploadDir, tempFileName)
  const newPath = path.join(uploadDir, newFileName)

  if (fs.existsSync(newPath)) {
    fs.unlinkSync(newPath)
  }

  fs.renameSync(tempPath, newPath)

  return `/uploads/${newFileName}`
}

export const deleteImageIfExists = (relativePath: string): void => {
  const fullPath = path.resolve(__dirname, '../../../' + relativePath)
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
  }
}
