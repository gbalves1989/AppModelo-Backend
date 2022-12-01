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
import redisCache from '../../shared/cache'

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
    const publishers = await redisCache.recover<PublisherEntity[]>(
      `${userId}-publishers`,
    )

    if (publishers) {
      await redisCache.invalidate(`${userId}-publishers`)
    }

    return this.publisherRepository.create(userId, { ...props })
  }

  async show({ ...props }: ShowPublisherDTO): Promise<PublisherEntity> {
    const publisher = await this.publisherRepository.findById({ ...props })

    if (!publisher) {
      throw new AppError('Editora não encontrada.', 404)
    }

    return publisher
  }

  async findAll(userId: string): Promise<PublisherEntity[]> {
    let publishers = await redisCache.recover<PublisherEntity[]>(
      `${userId}-publishers`,
    )

    if (!publishers) {
      publishers = await this.publisherRepository.findAll(userId)
      await redisCache.save(`${userId}-publishers`, publishers)
    }

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

    const publishers = await redisCache.recover<PublisherEntity[]>(
      `${userId}-publishers`,
    )

    if (publishers) {
      await redisCache.invalidate(`${userId}-publishers`)
    }

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

    const publishers = await redisCache.recover<PublisherEntity[]>(
      `${userId}-publishers`,
    )

    if (publishers) {
      await redisCache.invalidate(`${userId}-publishers`)
    }

    await this.publisherRepository.delete({ ...props })
  }
}
