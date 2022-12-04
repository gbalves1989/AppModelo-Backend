import { AppError } from '../../errors/AppError'
import { Request, Response, NextFunction } from 'express'
import { decode } from 'jsonwebtoken'

interface Payload {
  sub: string
}

export function isAuthentication(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authToken = request.headers.authorization

  if (!authToken) {
    throw new AppError('Não autorizado.', 401)
  }

  const token = authToken.replace('Bearer ', '')
  if (!token) {
    throw new AppError('Não autorizado.', 401)
  }

  try {
    const decodedToken = decode(token)
    const { sub } = decodedToken as Payload
    request.user_id = sub

    return next()
  } catch {
    throw new AppError('Não autorizado.', 401)
  }
}
