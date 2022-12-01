import prismaClient from '../prisma'
import {
  CreatePublisherDTO,
  DeletePublisherDTO,
  ShowPublisherDTO,
  UpdatePublisherDTO,
} from './dto/PublisherDTO'
import { PublisherEntity } from './entities/PublisherEntity'
import { IPublisherRepository } from './interfaces/IPublisherRepository'
import { PublisherSelect } from './selects/PublisherSelect'

export class PublisherRepository implements IPublisherRepository {
  async create(
    userId: string,
    { ...props }: CreatePublisherDTO,
  ): Promise<PublisherEntity> {
    const publisher = await prismaClient.publisher.create({
      data: {
        userId,
        name: props.name,
      },
      select: PublisherSelect,
    })

    return publisher as PublisherEntity
  }

  async update(
    id: string,
    { ...props }: UpdatePublisherDTO,
  ): Promise<PublisherEntity> {
    const publisher = await prismaClient.publisher.update({
      where: { id },
      data: { ...props },
      select: PublisherSelect,
    })

    return publisher as PublisherEntity
  }

  async delete({ ...props }: DeletePublisherDTO): Promise<void> {
    await prismaClient.publisher.delete({ where: { ...props } })
  }

  async findById({ ...props }: ShowPublisherDTO): Promise<PublisherEntity> {
    const publisher = await prismaClient.publisher.findFirst({
      where: { ...props },
      select: PublisherSelect,
    })

    return publisher as PublisherEntity
  }

  async findAll(userId: string): Promise<PublisherEntity[]> {
    const publishers = await prismaClient.publisher.findMany({
      where: { userId },
      select: PublisherSelect,
    })

    return publishers as PublisherEntity[]
  }
}
