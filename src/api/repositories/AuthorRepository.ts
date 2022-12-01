import prismaClient from '../prisma'
import {
  CreateAuthorDTO,
  UpdateAuthorDTO,
  UploadAuthorDTO,
  DeleteAuthorDTO,
  ShowAuthorDTO,
} from './dto/AuthorDTO'
import { AuthorEntity } from './entities/AuthorEntity'
import { IAuthorRepository } from './interfaces/IAuthorRepository'
import { AuthorSelect } from './selects/AuthorSelect'

export class AuthorRepository implements IAuthorRepository {
  async create(
    userId: string,
    { ...props }: CreateAuthorDTO,
  ): Promise<AuthorEntity> {
    const author = await prismaClient.author.create({
      data: {
        userId,
        name: props.name,
      },
      select: AuthorSelect,
    })

    return author as AuthorEntity
  }

  async update(
    id: string,
    { ...props }: UpdateAuthorDTO,
  ): Promise<AuthorEntity> {
    const author = await prismaClient.author.update({
      where: { id },
      data: { ...props },
      select: AuthorSelect,
    })

    return author as AuthorEntity
  }

  async upload(
    id: string,
    { ...props }: UploadAuthorDTO,
  ): Promise<AuthorEntity> {
    const author = await prismaClient.author.update({
      where: { id },
      data: { ...props },
      select: AuthorSelect,
    })

    return author as AuthorEntity
  }

  async delete({ ...props }: DeleteAuthorDTO): Promise<void> {
    const author = await prismaClient.author.delete({
      where: { ...props },
    })
  }

  async findById({ ...props }: ShowAuthorDTO): Promise<AuthorEntity> {
    const author = await prismaClient.author.findFirst({
      where: { ...props },
      select: AuthorSelect,
    })

    return author as AuthorEntity
  }

  async findAll(userId: string): Promise<AuthorEntity[]> {
    const authors = await prismaClient.author.findMany({
      where: { userId },
      select: AuthorSelect,
    })

    return authors as AuthorEntity[]
  }
}
