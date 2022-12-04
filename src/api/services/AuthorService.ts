import { RedisHelpers } from './../helpers/RedisHelpers'
import { inject, injectable } from 'tsyringe'
import { AppError } from '../../shared/errors/AppError'
import { IAuthorRepository } from '../repositories/interfaces/IAuthorRepository'
import {
  CreateAuthorDTO,
  DeleteAuthorDTO,
  ShowAuthorDTO,
  UpdateAuthorDTO,
  UploadAuthorDTO,
} from './../repositories/dto/AuthorDTO'
import { AuthorEntity } from './../repositories/entities/AuthorEntity'
import { UploadHelpers } from '../helpers/UploadHelpers'

@injectable()
export class AuthorService {
  constructor(
    @inject('AuthorRepository') private authorRepository: IAuthorRepository,
  ) {}

  async create(
    userId: string,
    { ...props }: CreateAuthorDTO,
  ): Promise<AuthorEntity> {
    await this.redisDelete(userId)
    return this.authorRepository.create(userId, { ...props })
  }

  async show({ ...props }: ShowAuthorDTO): Promise<AuthorEntity> {
    const author = await this.authorRepository.findById({ ...props })

    if (!author) {
      throw new AppError('Autor não encontrado.', 404)
    }

    return author
  }

  async findAll(userId: string): Promise<AuthorEntity[] | null> {
    const authors = await this.redisSave(userId)
    return authors
  }

  async update(
    userId: string,
    id: string,
    { ...props }: UpdateAuthorDTO,
  ): Promise<AuthorEntity> {
    const author = await this.authorRepository.findById({ id })

    if (!author) {
      throw new AppError('Autor não encontrado.', 404)
    }

    await this.redisDelete(userId)
    return this.authorRepository.update(id, { ...props })
  }

  async upload(
    userId: string,
    id: string,
    { ...props }: UploadAuthorDTO,
  ): Promise<AuthorEntity> {
    const uploadHelpers = new UploadHelpers()
    const author = await this.authorRepository.findById({ id })

    if (!author) {
      throw new AppError('Autor não encontrado.', 404)
    }

    if (author.avatar) {
      await uploadHelpers.delete(author.avatar)
    }

    props.avatar = await uploadHelpers.save(props.avatar)
    await this.redisDelete(userId)
    return this.authorRepository.upload(id, { ...props })
  }

  async delete(userId: string, { ...props }: DeleteAuthorDTO): Promise<void> {
    const uploadHelpers = new UploadHelpers()
    const author = await this.authorRepository.findById({ ...props })

    if (!author) {
      throw new AppError('Autor não encontrado.', 404)
    }

    if (author.avatar) {
      await uploadHelpers.delete(author.avatar)
    }

    await this.redisDelete(userId)
    await this.authorRepository.delete({ ...props })
  }

  private async redisDelete(userId: string): Promise<void> {
    const redis = new RedisHelpers()
    const authors = redis.getAuthors(userId)
    await redis.delete('authors', userId, authors)
  }

  private async redisSave(userId: string): Promise<AuthorEntity[] | null> {
    const redis = new RedisHelpers()
    const authors = await redis.getAuthors(userId)

    if (!authors) {
      const authors = await this.authorRepository.findAll(userId)
      await redis.save('authors', userId, authors)
    }

    return authors
  }
}
