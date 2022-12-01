import { container } from 'tsyringe'
import { BookController } from '../controllers/BookController'
import { BookRepository } from '../repositories/BookRepository'
import { IBookRepository } from '../repositories/interfaces/IBookRepository'

container.registerSingleton<IBookRepository>('BookRepository', BookRepository)

container.registerSingleton('BookController', BookController)
