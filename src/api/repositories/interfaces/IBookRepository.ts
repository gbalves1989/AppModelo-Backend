import { BookEntity } from './../entities/BookEntity'
import {
  CreateBookDTO,
  DeleteBookDTO,
  ShowBookDTO,
  UpdateBookDTO,
} from './../dto/BookDTO'

export interface IBookRepository {
  create(userId: string, { ...props }: CreateBookDTO): Promise<BookEntity>
  update(id: string, { ...props }: UpdateBookDTO): Promise<BookEntity>
  delete({ ...props }: DeleteBookDTO): Promise<void>
  findById({ ...props }: ShowBookDTO): Promise<BookEntity>
  findAll(userId: string): Promise<BookEntity[]>
}
