import { compare, hash } from 'bcryptjs'
import { Secret, sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'
import configAuth from '../../config/auth'
import { AppError } from '../../shared/errors/AppError'
import { UploadHelpers } from '../helpers/UploadHelpers'
import { IUserRepository } from '../repositories/interfaces/IUserRepository'
import {
  AuthTokenDTO,
  AuthUserDTO,
  CreateUserDTO,
  ShowUserDTO,
  UpdateUserDTO,
  UploadAvatarDTO,
} from './../repositories/dto/UserDTO'
import { UserEntity } from './../repositories/entities/UserEntity'

@injectable()
export class UserService {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async create({ ...props }: CreateUserDTO): Promise<UserEntity> {
    const userEmailAlreadyExists = await this.userRepository.findByEmail(
      props.email,
    )

    if (userEmailAlreadyExists) {
      throw new AppError('Email já existe.')
    }

    const passwordHash = await hash(props.password, 8)
    props.password = passwordHash
    return this.userRepository.create({ ...props })
  }

  async auth({ ...props }: AuthUserDTO): Promise<AuthTokenDTO> {
    const user = await this.userRepository.findByEmail(props.email)

    if (!user) {
      throw new AppError('Email ou senha incorreto.')
    }

    const passwordVerify = await compare(props.password, user.password)

    if (!passwordVerify) {
      throw new AppError('Email ou senha incorreto.')
    }

    const token = sign(
      {
        email: user.email,
      },
      configAuth.jwt.secret as Secret,
      {
        subject: user.id,
        expiresIn: configAuth.jwt.expiresIn,
      },
    )

    return {
      id: user.id,
      email: user.email,
      token: token,
    }
  }

  async show({ id }: ShowUserDTO): Promise<UserEntity> {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404)
    }

    return user
  }

  async update(id: string, { ...props }: UpdateUserDTO): Promise<UserEntity> {
    const user = this.userRepository.findById(id)

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404)
    }

    return this.userRepository.update(id, { ...props })
  }

  async upload(id: string, { ...props }: UploadAvatarDTO): Promise<UserEntity> {
    const uploadHelpers = new UploadHelpers()
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404)
    }

    if (user.avatar) {
      await uploadHelpers.delete(user.avatar)
    }

    props.avatar = await uploadHelpers.save(props.avatar)
    return this.userRepository.upload(id, { ...props })
  }
}
