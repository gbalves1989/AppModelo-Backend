import { AuthorEntity } from '../entities/AuthorEntity'
import {
  CreateAuthorDTO,
  DeleteAuthorDTO,
  ShowAuthorDTO,
  UpdateAuthorDTO,
  UploadAuthorDTO,
} from './../dto/AuthorDTO'

export interface IAuthorRepository {
  create(userId: string, { ...props }: CreateAuthorDTO): Promise<AuthorEntity>
  update(id: string, { ...props }: UpdateAuthorDTO): Promise<AuthorEntity>
  upload(id: string, { ...props }: UploadAuthorDTO): Promise<AuthorEntity>
  delete({ ...props }: DeleteAuthorDTO): Promise<void>
  findById({ ...props }: ShowAuthorDTO): Promise<AuthorEntity>
  findAll(userId: string): Promise<AuthorEntity[]>
}
