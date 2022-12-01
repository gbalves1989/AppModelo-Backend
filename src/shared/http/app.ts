import 'reflect-metadata'
import 'express-async-errors'
import '../../shared/container'
import express, { Request, Response, NextFunction } from 'express'
import configPath from '../../config/index'
import { AppError } from '../errors/AppError'
import { router } from '../routes'
import { limit } from '../middlewares/rateLimit'

const app = express()

app.use(configPath.corsConfig())
app.use(express.json())
app.use('/files', express.static(configPath.multerConfig.directory))
app.use(
  '/docs',
  configPath.swaggerConfig.swagger_ui.serve,
  configPath.swaggerConfig.swagger_ui.setup(
    configPath.swaggerConfig.swagger_file,
  ),
)
app.use(limit)
app.use(router)
app.use(configPath.celebrateConfig())

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
