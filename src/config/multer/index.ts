import crypto from 'crypto'
import multer, { StorageEngine } from 'multer'
import path from 'path'

interface IMulterConfig {
  driver: 's3' | 'disk'
  tmpFolder: string
  directory: string
  multer: {
    storage: StorageEngine
  }
  config: {
    aws: {
      bucket: string
    }
  }
}

const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads')
const tmpFolder = path.resolve(__dirname, '..', '..', 'temp')

export default {
  driver: process.env.STORAGE_DRIVER,
  directory: uploadFolder,
  tmpFolder,
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename: (request, file, callback) => {
        const fileHash = crypto.randomBytes(16).toString('hex')
        const filename = `${fileHash}-${file.originalname}`

        return callback(null, filename)
      },
    }),
  },
  config: {
    aws: {
      bucket: process.env.AWS_S3_BUCKET,
    },
  },
} as IMulterConfig
