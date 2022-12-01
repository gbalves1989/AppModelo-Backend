import prismaClient from '../prisma'
import { CreateUserDTO, UpdateUserDTO, UploadAvatarDTO } from './dto/UserDTO'
import { UserEntity, UserPassEntity } from './entities/UserEntity'
import { IUserRepository } from './interfaces/IUserRepository'
import { UserSelect, UserSelectWithPass } from './selects/UserSelect'

export class UserRepository implements IUserRepository {
  async create({ ...props }: CreateUserDTO): Promise<UserEntity> {
    const user = await prismaClient.user.create({
      data: { ...props },
      select: UserSelect,
    })

    return user as UserEntity
  }

  async update(id: string, { ...props }: UpdateUserDTO): Promise<UserEntity> {
    const user = await prismaClient.user.update({
      where: { id },
      data: { ...props },
      select: UserSelect,
    })

    return user as UserEntity
  }

  async upload(id: string, { ...props }: UploadAvatarDTO): Promise<UserEntity> {
    const user = await prismaClient.user.update({
      where: { id },
      data: { ...props },
      select: UserSelect,
    })

    return user as UserEntity
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await prismaClient.user.findFirst({
      where: { id },
      select: UserSelect,
    })

    return user as UserEntity
  }

  async findByEmail(email: string): Promise<UserPassEntity> {
    const user = await prismaClient.user.findFirst({
      where: { email },
      select: UserSelectWithPass,
    })

    return user as UserPassEntity
  }
}
