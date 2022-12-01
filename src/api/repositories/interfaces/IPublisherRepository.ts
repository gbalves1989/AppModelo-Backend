import { PublisherEntity } from '../entities/PublisherEntity'
import {
  CreatePublisherDTO,
  DeletePublisherDTO,
  ShowPublisherDTO,
  UpdatePublisherDTO,
} from './../dto/PublisherDTO'

export interface IPublisherRepository {
  create(
    userId: string,
    { ...props }: CreatePublisherDTO,
  ): Promise<PublisherEntity>
  update(id: string, { ...props }: UpdatePublisherDTO): Promise<PublisherEntity>
  delete({ ...props }: DeletePublisherDTO): Promise<void>
  findById({ ...props }: ShowPublisherDTO): Promise<PublisherEntity>
  findAll(userId: string): Promise<PublisherEntity[]>
}
