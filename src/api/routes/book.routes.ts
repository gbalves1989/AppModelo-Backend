import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import { container } from 'tsyringe'
import { isAuthentication } from '../../shared/http/middlewares/isAuthenticated'
import { BookController } from '../controllers/BookController'

const bookRouter = Router()

const bookController = container.resolve(BookController)

bookRouter.post(
  '/',
  isAuthentication,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required(),
      year: Joi.string().required(),
      authorId: Joi.string().uuid().required(),
      publisherId: Joi.string().uuid().required(),
    }),
  }),
  (request, response) => {
    return bookController.create(request, response)
  },
)

bookRouter.get(
  '/:id',
  isAuthentication,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required(),
    }),
  }),
  (request, response) => {
    return bookController.show(request, response)
  },
)

bookRouter.get('/', isAuthentication, (request, response) => {
  return bookController.findAll(request, response)
})

bookRouter.patch(
  '/:id',
  isAuthentication,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required(),
    }),
  }),
  (request, response) => {
    return bookController.update(request, response)
  },
)

bookRouter.delete(
  '/:id',
  isAuthentication,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required(),
    }),
  }),
  (request, response) => {
    return bookController.delete(request, response)
  },
)

export { bookRouter }
