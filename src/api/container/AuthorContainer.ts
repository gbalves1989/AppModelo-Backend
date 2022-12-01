import { container } from 'tsyringe'

import { AuthorController } from '../controllers/AuthorController'
import { IAuthorRepository } from '../repositories/interfaces/IAuthorRepository'
import { AuthorRepository } from '../repositories/AuthorRepository'

container.registerSingleton<IAuthorRepository>(
  'AuthorRepository',
  AuthorRepository,
)

container.registerSingleton('AuthorController', AuthorController)
