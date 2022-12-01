import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { PublisherService } from './../services/PublisherService'

export class PublisherController {
  async create(request: Request, response: Response): Promise<Response> {
    const publisherService = container.resolve(PublisherService)
    const userId = request.user_id
    const { ...props } = request.body
    const publisher = await publisherService.create(userId, { ...props })

    return response.status(201).json(publisher)
  }

  async show(request: Request, response: Response): Promise<Response> {
    const publisherService = container.resolve(PublisherService)
    const { id } = request.params
    const publisher = await publisherService.show({ id })

    return response.json(publisher)
  }

  async findAll(request: Request, response: Response): Promise<Response> {
    const publisherService = container.resolve(PublisherService)
    const userId = request.user_id
    const publishers = await publisherService.findAll(userId)

    return response.json(publishers)
  }

  async update(request: Request, response: Response): Promise<Response> {
    const publisherService = container.resolve(PublisherService)
    const { id } = request.params
    const userId = request.user_id
    const { ...props } = request.body
    const publisher = await publisherService.update(userId, id, { ...props })

    return response.json(publisher)
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const publisherService = container.resolve(PublisherService)
    const { id } = request.params
    const userId = request.user_id
    await publisherService.delete(userId, { id })

    return response.status(204).json({})
  }
}
