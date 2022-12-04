import 'reflect-metadata'
import 'express-async-errors'
import '../../shared/container'
import express, { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppError'
import { router } from './routes'
import { limit } from './middlewares/rateLimit'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from './swagger/swagger.json'
import cors from 'cors'
import { errors } from 'celebrate'
import multerConfig from '../../config/multer'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/files', express.static(multerConfig.directory))
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use(limit)
app.use(router)
app.use(errors())

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      })
    }

    return response.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    })
  },
)

export { app }
