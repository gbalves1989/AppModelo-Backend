import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { BookService } from '../services/BookService'

export class BookController {
  async create(request: Request, response: Response): Promise<Response> {
    const bookService = container.resolve(BookService)
    const userId = request.user_id
    const { ...props } = request.body
    const book = await bookService.create(userId, { ...props })

    return response.status(201).json(book)
  }

  async show(request: Request, response: Response): Promise<Response> {
    const bookService = container.resolve(BookService)
    const { id } = request.params
    const book = await bookService.show({ id })

    return response.json(book)
  }

  async findAll(request: Request, response: Response): Promise<Response> {
    const bookService = container.resolve(BookService)
    const userId = request.user_id
    const books = await bookService.findAll(userId)

    return response.json(books)
  }

  async update(request: Request, response: Response): Promise<Response> {
    const bookService = container.resolve(BookService)
    const { id } = request.params
    const userId = request.user_id
    const { ...props } = request.body
    const book = await bookService.update(userId, id, { ...props })

    return response.json(book)
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const bookService = container.resolve(BookService)
    const { id } = request.params
    const userId = request.user_id
    await bookService.delete(userId, { id })

    return response.status(204).json({})
  }
}
