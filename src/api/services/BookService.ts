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
import { RedisHelpers } from '../helpers/RedisHelpers'

@injectable()
export class BookService {
  constructor(
    @inject('BookRepository') private bookRepository: IBookRepository,
  ) {}

  async create(
    userId: string,
    { ...props }: CreateBookDTO,
  ): Promise<BookEntity> {
    if (process.env.SERVICE_CACHE === 'redis') {
      await this.redisDelete(userId)
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

  async findAll(userId: string): Promise<BookEntity[] | null> {
    if (process.env.SERVICE_CACHE === 'redis') {
      const books = this.redisSave(userId)
      return books
    } else {
      return this.bookRepository.findAll(userId)
    }
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

    if (process.env.SERVICE_CACHE === 'redis') {
      await this.redisDelete(userId)
    }

    return this.bookRepository.update(id, { ...props })
  }

  async delete(userId: string, { ...props }: DeleteBookDTO): Promise<void> {
    const book = await this.bookRepository.findById({ ...props })

    if (!book) {
      throw new AppError('Livro não encontrado.', 404)
    }

    if (process.env.SERVICE_CACHE === 'redis') {
      await this.redisDelete(userId)
    }

    await this.bookRepository.delete({ ...props })
  }

  private async redisDelete(userId: string): Promise<void> {
    const redis = new RedisHelpers()
    const books = redis.getBooks(userId)
    await redis.delete('books', userId, books)
  }

  private async redisSave(userId: string): Promise<BookEntity[] | null> {
    const redis = new RedisHelpers()
    const books = await redis.getBooks(userId)

    if (!books) {
      const books = await this.bookRepository.findAll(userId)
      await redis.save('publishers', userId, books)
    }

    return books
  }
}
