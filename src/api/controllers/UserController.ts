import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { AppError } from '../../shared/errors/AppError'
import { UserService } from '../services/UserService'

export class UserController {
  async create(request: Request, response: Response): Promise<Response> {
    const userService = container.resolve(UserService)
    const { ...props } = request.body
    const user = await userService.create({ ...props })

    return response.status(201).json(user)
  }

  async auth(request: Request, response: Response): Promise<Response> {
    const userService = container.resolve(UserService)
    const { ...props } = request.body
    const user = await userService.auth({ ...props })

    return response.json(user)
  }

  async show(request: Request, response: Response): Promise<Response> {
    const userService = container.resolve(UserService)
    const id = request.user_id
    const user = await userService.show({ id })

    return response.json(user)
  }

  async update(request: Request, response: Response): Promise<Response> {
    const userService = container.resolve(UserService)
    const id = request.user_id
    const { ...props } = request.body
    const user = await userService.update(id, { ...props })

    return response.json(user)
  }

  async upload(request: Request, response: Response): Promise<Response> {
    const userService = container.resolve(UserService)
    const id = request.user_id

    if (!request.file) {
      throw new AppError('Falha ao carregar avatar.')
    }

    const { originalname, filename: avatar } = request.file
    const user = await userService.upload(id, { avatar })

    return response.json(user)
  }
}
