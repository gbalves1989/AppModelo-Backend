import fs from 'fs'
import path from 'path'
import { inject, injectable } from 'tsyringe'
import configPath from '../../config'
import redisCache from '../../shared/cache'
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

@injectable()
export class AuthorService {
  constructor(
    @inject('AuthorRepository') private authorRepository: IAuthorRepository,
  ) {}

  async create(
    userId: string,
    { ...props }: CreateAuthorDTO,
  ): Promise<AuthorEntity> {
    const authors = await redisCache.recover<AuthorEntity[]>(
      `${userId}-authors`,
    )

    if (authors) {
      await redisCache.invalidate(`${userId}-authors`)
    }

    return this.authorRepository.create(userId, { ...props })
  }

  async show({ ...props }: ShowAuthorDTO): Promise<AuthorEntity> {
    const author = await this.authorRepository.findById({ ...props })

    if (!author) {
      throw new AppError('Autor não encontrado.', 404)
    }

    return author
  }

  async findAll(userId: string): Promise<AuthorEntity[]> {
    let authors = await redisCache.recover<AuthorEntity[]>(`${userId}-authors`)

    if (!authors) {
      authors = await this.authorRepository.findAll(userId)
      await redisCache.save(`${userId}-authors`, authors)
    }

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

    const authors = await redisCache.recover<AuthorEntity[]>(
      `${userId}-authors`,
    )

    if (authors) {
      await redisCache.invalidate(`${userId}-authors`)
    }

    return this.authorRepository.update(id, { ...props })
  }

  async upload(
    userId: string,
    id: string,
    { ...props }: UploadAuthorDTO,
  ): Promise<AuthorEntity> {
    const author = await this.authorRepository.findById({ id })

    if (!author) {
      throw new AppError('Autor não encontrado.', 404)
    }

    if (author.avatar) {
      const authorAvatarFilePath = path.join(
        configPath.multerConfig.directory,
        author.avatar,
      )

      const authorAvatarFileExists = await fs.promises.stat(
        authorAvatarFilePath,
      )

      if (authorAvatarFileExists) {
        await fs.promises.unlink(authorAvatarFilePath)
      }
    }

    const authors = await redisCache.recover<AuthorEntity[]>(
      `${userId}-authors`,
    )

    if (authors) {
      await redisCache.invalidate(`${userId}-authors`)
    }

    return this.authorRepository.upload(id, { ...props })
  }

  async delete(userId: string, { ...props }: DeleteAuthorDTO): Promise<void> {
    const author = await this.authorRepository.findById({ ...props })

    if (!author) {
      throw new AppError('Autor não encontrado.', 404)
    }

    if (author.avatar) {
      const authorAvatarFilePath = path.join(
        configPath.multerConfig.directory,
        author.avatar,
      )

      const authorAvatarFileExists = await fs.promises.stat(
        authorAvatarFilePath,
      )

      if (authorAvatarFileExists) {
        await fs.promises.unlink(authorAvatarFilePath)
      }
    }

    const authors = await redisCache.recover<AuthorEntity[]>(
      `${userId}-authors`,
    )

    if (authors) {
      await redisCache.invalidate(`${userId}-authors`)
    }

    await this.authorRepository.delete({ ...props })
  }
}
