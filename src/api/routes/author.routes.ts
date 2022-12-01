import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import multer from 'multer'
import { container } from 'tsyringe'

import configPath from '../../config'
import { isAuthentication } from '../../shared/middlewares/isAuthenticated'
import { AuthorController } from '../controllers/AuthorController'

const authorRouter = Router()

const upload = multer(configPath.multerConfig)

const authorController = container.resolve(AuthorController)

authorRouter.post(
  '/',
  isAuthentication,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
    }),
  }),
  (request, response) => {
    return authorController.create(request, response)
  },
)

authorRouter.get(
  '/:id',
  isAuthentication,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required(),
    }),
  }),
  (request, response) => {
    return authorController.show(request, response)
  },
)

authorRouter.get('/', isAuthentication, (request, response) => {
  return authorController.findAll(request, response)
})

authorRouter.patch(
  '/:id',
  isAuthentication,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required(),
    }),
  }),
  (request, response) => {
    return authorController.update(request, response)
  },
)

authorRouter.patch(
  '/upload/:id',
  isAuthentication,
  upload.single('avatar'),
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required(),
    }),
  }),
  (request, response) => {
    return authorController.upload(request, response)
  },
)

authorRouter.delete(
  '/:id',
  isAuthentication,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required(),
    }),
  }),
  (request, response) => {
    return authorController.delete(request, response)
  },
)

export { authorRouter }
