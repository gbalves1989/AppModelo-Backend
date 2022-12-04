import redisCache from '../../shared/cache'
import { AuthorEntity } from '../repositories/entities/AuthorEntity'
import { PublisherEntity } from '../repositories/entities/PublisherEntity'
import { BookEntity } from '../repositories/entities/BookEntity'

export class RedisHelpers {
  public async getAuthors(userId: string): Promise<AuthorEntity[] | null> {
    return redisCache.recover<AuthorEntity[]>(`${userId}-authors`)
  }

  public async getPublishers(
    userId: string,
  ): Promise<PublisherEntity[] | null> {
    return redisCache.recover<PublisherEntity[]>(`${userId}-publishers`)
  }

  public async getBooks(userId: string): Promise<BookEntity[] | null> {
    return redisCache.recover<BookEntity[]>(`${userId}-books`)
  }

  public async save(model: string, userId: string, entity: object) {
    await redisCache.save(`${userId}-${model}`, entity)
  }

  public async delete(
    model: string,
    userId: string,
    entity: object | null,
  ): Promise<void> {
    if (entity) {
      await redisCache.invalidate(`${userId}-${model}`)
    }
  }
}
