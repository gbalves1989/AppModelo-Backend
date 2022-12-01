import { BookEntity } from './../repositories/entities/BookEntity'
import {
  CreateBookDTO,
  DeleteBookDTO,
  ShowBookDTO,
  UpdateBookDTO,
} from './../repositories/dto/BookDTO'
import { AppError } from '../../shared/errors/AppError'
import { injectable, inject } from 'tsyringe'
import { IBookRepository } from '../repositories/interfaces/IBookRepository'
import redisCache from '../../shared/cache'

@injectable()
export class BookService {
  constructor(
    @inject('BookRepository') private bookRepository: IBookRepository,
  ) {}

  async create(
    userId: string,
    { ...props }: CreateBookDTO,
  ): Promise<BookEntity> {
    const publishers = await redisCache.recover<BookEntity[]>(`${userId}-books`)

    if (publishers) {
      await redisCache.invalidate(`${userId}-books`)
    }

    return this.bookRepository.create(userId, { ...props })
  }

  async show({ ...props }: ShowBookDTO): Promise<BookEntity> {
    const book = await this.bookRepository.findById({ ...props })

    if (!book) {
      throw new AppError('Livro não encontrado.', 404)
    }

    return book
  }

  async findAll(userId: string): Promise<BookEntity[]> {
    let books = await redisCache.recover<BookEntity[]>(`${userId}-books`)

    if (!books) {
      books = await this.bookRepository.findAll(userId)
      await redisCache.save(`${userId}-books`, books)
    }

    return books
  }

  async update(
    userId: string,
    id: string,
    { ...props }: UpdateBookDTO,
  ): Promise<BookEntity> {
    const book = await this.bookRepository.findById({ id })

    if (!book) {
      throw new AppError('Editora não encontrada.', 404)
    }

    const books = await redisCache.recover<BookEntity[]>(`${userId}-books`)

    if (books) {
      await redisCache.invalidate(`${userId}-books`)
    }

    return this.bookRepository.update(id, { ...props })
  }

  async delete(userId: string, { ...props }: DeleteBookDTO): Promise<void> {
    const book = await this.bookRepository.findById({ ...props })

    if (!book) {
      throw new AppError('Livro não encontrado.', 404)
    }

    const books = await redisCache.recover<BookEntity[]>(`${userId}-books`)

    if (books) {
      await redisCache.invalidate(`${userId}-books`)
    }

    await this.bookRepository.delete({ ...props })
  }
}
