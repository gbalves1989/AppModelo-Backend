import { container } from 'tsyringe'

import { PublisherController } from '../controllers/PublisherController'
import { IPublisherRepository } from '../repositories/interfaces/IPublisherRepository'
import { PublisherRepository } from '../repositories/PublisherRepository'

container.registerSingleton<IPublisherRepository>(
  'PublisherRepository',
  PublisherRepository,
)

container.registerSingleton('PublisherController', PublisherController)
