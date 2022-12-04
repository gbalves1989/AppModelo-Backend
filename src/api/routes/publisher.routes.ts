import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import { container } from 'tsyringe'
import { isAuthentication } from '../../shared/http/middlewares/isAuthenticated'
import { PublisherController } from '../controllers/PublisherController'

const publisherRouter = Router()

const publisherController = container.resolve(PublisherController)

publisherRouter.post(
  '/',
  isAuthentication,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
    }),
  }),
  (request, response) => {
    return publisherController.create(request, response)
  },
)

publisherRouter.get(
  '/:id',
  isAuthentication,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required(),
    }),
  }),
  (request, response) => {
    return publisherController.show(request, response)
  },
)

publisherRouter.get('/', isAuthentication, (request, response) => {
  return publisherController.findAll(request, response)
})

publisherRouter.patch(
  '/:id',
  isAuthentication,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required(),
    }),
  }),
  (request, response) => {
    return publisherController.update(request, response)
  },
)

publisherRouter.delete(
  '/:id',
  isAuthentication,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required(),
    }),
  }),
  (request, response) => {
    return publisherController.delete(request, response)
  },
)

export { publisherRouter }
