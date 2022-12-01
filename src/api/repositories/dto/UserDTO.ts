export type CreateUserDTO = {
  name: string
  email: string
  password: string
}

export type AuthUserDTO = {
  email: string
  password: string
}

export type AuthTokenDTO = {
  id: string
  email: string
  token: string
}

export type ShowUserDTO = {
  id: string
}

export type UpdateUserDTO = {
  name: string
}

export type UploadAvatarDTO = {
  avatar: string
}
