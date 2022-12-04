import fs from 'fs'
import path from 'path'
import request from 'supertest'

import configUpload from '../../config/multer'
import { app } from '../../shared/http/app'

describe('Teste nas rotas de usuários', () => {
  test('Usuário criado com sucesso.', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'gabriel alves',
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('gabriel alves')
  })

  test('Usuário logado com sucesso.', async () => {
    const response = await request(app).post('/api/v1/users/auth').send({
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })

  test('Informações do usuário realizado com sucesso.', async () => {
    const responseToken = await request(app).post('/api/v1/users/auth').send({
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

    const response = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('gabriel alves')
  })

  test('Usuário atualizado com sucesso.', async () => {
    const responseToken = await request(app).post('/api/v1/users/auth').send({
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

    const response = await request(app)
      .patch('/api/v1/users')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'gabriel brondani alves',
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('gabriel brondani alves')
  })

  test('Avatar do usuário atualizado com sucesso.', async () => {
    const responseToken = await request(app).post('/api/v1/users/auth').send({
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

    const response = await request(app)
      .patch('/api/v1/users/upload')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .field('Content-Type', 'multipart/form-data')
      .attach('avatar', './src/api/__tests__/uploads/user-teste.jpg', {
        filename: 'user-teste.jpg',
        contentType: 'application/jpg',
      })

    expect(response.status).toBe(200)

    if (response.body.avatar) {
      const userAvatarFilePath = path.join(
        configUpload.directory,
        response.body.avatar,
      )
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath)

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath)
      }
    }
  })
})
