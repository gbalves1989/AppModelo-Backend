import { IBookRepository } from './interfaces/IBookRepository'
import prismaClient from '../prisma'
import {
  CreateBookDTO,
  UpdateBookDTO,
  DeleteBookDTO,
  ShowBookDTO,
} from './dto/BookDTO'
import { BookEntity } from './entities/BookEntity'
import { BookSelect } from './selects/BookSelect'

export class BookRepository implements IBookRepository {
  async create(
    userId: string,
    { ...props }: CreateBookDTO,
  ): Promise<BookEntity> {
    const book = await prismaClient.book.create({
      data: {
        userId,
        title: props.title,
        year: props.year,
        authorId: props.authorId,
        publisherId: props.publisherId,
      },
      select: BookSelect,
    })

    return book as BookEntity
  }

  async update(id: string, { ...props }: UpdateBookDTO): Promise<BookEntity> {
    const book = await prismaClient.book.update({
      where: { id },
      data: { ...props },
      select: BookSelect,
    })

    return book as BookEntity
  }

  async delete({ ...props }: DeleteBookDTO): Promise<void> {
    await prismaClient.book.delete({ where: { ...props } })
  }

  async findById({ ...props }: ShowBookDTO): Promise<BookEntity> {
    const book = await prismaClient.book.findFirst({
      where: { ...props },
      select: BookSelect,
    })

    return book as BookEntity
  }

  async findAll(userId: string): Promise<BookEntity[]> {
    const book = await prismaClient.book.findMany({
      where: { userId },
      select: BookSelect,
    })

    return book as BookEntity[]
  }
}
