import { container } from 'tsyringe'

import { UserController } from '../controllers/UserController'
import { IUserRepository } from '../repositories/interfaces/IUserRepository'
import { UserRepository } from '../repositories/UserRepository'

container.registerSingleton<IUserRepository>('UserRepository', UserRepository)

container.registerSingleton('UserController', UserController)
