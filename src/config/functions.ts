export const renameFile = (req: any, file: any, cb: any) => {
  const ext = file.originalname.split('.').pop()
  const newName = `${file.fieldname}_${Date.now()}.${ext}`
  cb(null, newName)
}
