import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import multer from 'multer'
import { container } from 'tsyringe'

import configPath from '../../config'
import { isAuthentication } from '../../shared/middlewares/isAuthenticated'
import { UserController } from '../controllers/UserController'

const userRouter = Router()

const upload = multer(configPath.multerConfig)

const userController = container.resolve(UserController)

userRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(10).max(20).required(),
    }),
  }),
  (request, response) => {
    return userController.create(request, response)
  },
)

userRouter.post(
  '/auth',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(10).max(20).required(),
    }),
  }),
  (request, response) => {
    return userController.auth(request, response)
  },
)

userRouter.get('/me', isAuthentication, (request, response) => {
  return userController.show(request, response)
})

userRouter.patch('/', isAuthentication, (request, response) => {
  return userController.update(request, response)
})

userRouter.patch(
  '/upload',
  isAuthentication,
  upload.single('avatar'),
  (request, response) => {
    return userController.upload(request, response)
  },
)

export { userRouter }
