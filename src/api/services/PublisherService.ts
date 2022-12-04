import { AppError } from '../../shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import { PublisherEntity } from '../repositories/entities/PublisherEntity'
import { IPublisherRepository } from '../repositories/interfaces/IPublisherRepository'
import {
  CreatePublisherDTO,
  DeletePublisherDTO,
  ShowPublisherDTO,
  UpdatePublisherDTO,
} from './../repositories/dto/PublisherDTO'
import { RedisHelpers } from '../helpers/RedisHelpers'

@injectable()
export class PublisherService {
  constructor(
    @inject('PublisherRepository')
    private publisherRepository: IPublisherRepository,
  ) {}

  async create(
    userId: string,
    { ...props }: CreatePublisherDTO,
  ): Promise<PublisherEntity> {
    await this.redisDelete(userId)
    return this.publisherRepository.create(userId, { ...props })
  }

  async show({ ...props }: ShowPublisherDTO): Promise<PublisherEntity> {
    const publisher = await this.publisherRepository.findById({ ...props })

    if (!publisher) {
      throw new AppError('Editora não encontrada.', 404)
    }

    return publisher
  }

  async findAll(userId: string): Promise<PublisherEntity[] | null> {
    const publishers = await this.redisSave(userId)
    return publishers
  }

  async update(
    userId: string,
    id: string,
    { ...props }: UpdatePublisherDTO,
  ): Promise<PublisherEntity> {
    const publisher = await this.publisherRepository.findById({ id })

    if (!publisher) {
      throw new AppError('Editora não encontrada.', 404)
    }

    await this.redisDelete(userId)
    return this.publisherRepository.update(id, { ...props })
  }

  async delete(
    userId: string,
    { ...props }: DeletePublisherDTO,
  ): Promise<void> {
    const publisher = await this.publisherRepository.findById({ ...props })

    if (!publisher) {
      throw new AppError('Editora não encontrada.', 404)
    }

    await this.redisDelete(userId)
    await this.publisherRepository.delete({ ...props })
  }

  private async redisDelete(userId: string): Promise<void> {
    const redis = new RedisHelpers()
    const publishers = redis.getPublishers(userId)
    await redis.delete('publishers', userId, publishers)
  }

  private async redisSave(userId: string): Promise<PublisherEntity[] | null> {
    const redis = new RedisHelpers()
    const publishers = await redis.getPublishers(userId)

    if (!publishers) {
      const publishers = await this.publisherRepository.findAll(userId)
      await redis.save('publishers', userId, publishers)
    }

    return publishers
  }
}
