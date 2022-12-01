import { cors } from './cors'
import { errors } from './celebrate'
import { upload } from './multer'
import { swaggerUi, swaggerFile } from './swagger'
import auth from './auth'
import redis from './redis'

export default {
  corsConfig: cors,
  celebrateConfig: errors,
  multerConfig: upload,
  swaggerConfig: {
    swagger_ui: swaggerUi,
    swagger_file: swaggerFile,
  },
  authConfig: auth,
  redisConfig: redis,
}
