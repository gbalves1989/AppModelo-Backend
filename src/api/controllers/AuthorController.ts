import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { AuthorService } from '../services/AuthorService'
import { AppError } from './../../shared/errors/AppError'

export class AuthorController {
  async create(request: Request, response: Response): Promise<Response> {
    const authorService = container.resolve(AuthorService)
    const userId = request.user_id
    const { ...props } = request.body
    const author = await authorService.create(userId, { ...props })

    return response.status(201).json(author)
  }

  async update(request: Request, response: Response): Promise<Response> {
    const authorService = container.resolve(AuthorService)
    const { id } = request.params
    const userId = request.user_id
    const { ...props } = request.body
    const author = await authorService.update(userId, id, { ...props })

    return response.json(author)
  }

  async upload(request: Request, response: Response): Promise<Response> {
    const authorService = container.resolve(AuthorService)
    const { id } = request.params
    const userId = request.user_id

    if (!request.file) {
      throw new AppError('Falha ao carregar avatar.')
    }

    const { originalname, filename: avatar } = request.file
    const author = await authorService.upload(userId, id, { avatar })

    return response.json(author)
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const authorService = container.resolve(AuthorService)
    const { id } = request.params
    const userId = request.user_id
    await authorService.delete(userId, { id })

    return response.status(204).json({})
  }

  async show(request: Request, response: Response): Promise<Response> {
    const authorService = container.resolve(AuthorService)
    const { id } = request.params
    const author = await authorService.show({ id })

    return response.json(author)
  }

  async findAll(request: Request, response: Response): Promise<Response> {
    const authorService = container.resolve(AuthorService)
    const userId = request.user_id
    const authors = await authorService.findAll(userId)

    return response.json(authors)
  }
}
