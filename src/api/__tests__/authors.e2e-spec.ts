import fs from 'fs'
import path from 'path'
import request from 'supertest'

import configPath from '../../config'
import { app } from '../../shared/http/app'
import redisCache from '../../shared/cache'

describe('Teste nas rotas de autores', () => {
  test('Autor criado com sucesso.', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'gabriel alves',
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

    const responseToken = await request(app).post('/api/v1/users/auth').send({
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

    const response = await request(app)
      .post('/api/v1/authors')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'machado de assis',
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('machado de assis')
  })

  test('Autor encontrado com sucesso.', async () => {
    const responseToken = await request(app).post('/api/v1/users/auth').send({
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

    const responseAuthor = await request(app)
      .post('/api/v1/authors')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'john green',
      })

    const response = await request(app)
      .get(`/api/v1/authors/${responseAuthor.body.id}`)
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send()

    expect(response.status).toBe(200)
  })

  test('Lista de autores retonada com sucesso.', async () => {
    const responseToken = await request(app).post('/api/v1/users/auth').send({
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

    const responseAuthor = await request(app)
      .post('/api/v1/authors')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'john green',
      })

    const response = await request(app)
      .get('/api/v1/authors')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send()

    expect(response.status).toBe(200)
  })

  test('Autor atualizado com sucesso.', async () => {
    const responseToken = await request(app).post('/api/v1/users/auth').send({
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

    const responseAuthor = await request(app)
      .post('/api/v1/authors')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'john green',
      })

    await request(app)
      .get('/api/v1/authors')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send()

    const response = await request(app)
      .patch(`/api/v1/authors/${responseAuthor.body.id}`)
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'gabriel alves',
      })

    expect(response.status).toBe(200)
  })

  test('Avatar do autor atualizado com sucesso.', async () => {
    const responseToken = await request(app).post('/api/v1/users/auth').send({
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

    const responseAuthor = await request(app)
      .post('/api/v1/authors')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'john green',
      })

    await request(app)
      .get('/api/v1/authors')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send()

    const response = await request(app)
      .patch(`/api/v1/authors/upload/${responseAuthor.body.id}`)
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .field('Content-Type', 'multipart/form-data')
      .attach('avatar', './src/api/__tests__/uploads/author-teste.jpg', {
        filename: 'author-teste.jpg',
        contentType: 'application/jpg',
      })

    expect(response.status).toBe(200)

    if (response.body.avatar) {
      const AvatarFilePath = path.join(
        configPath.multerConfig.directory,
        response.body.avatar,
      )
      const AvatarFileExists = await fs.promises.stat(AvatarFilePath)

      if (AvatarFileExists) {
        await fs.promises.unlink(AvatarFilePath)
      }
    }
  })

  test('Autor deletado com sucesso.', async () => {
    const responseToken = await request(app).post('/api/v1/users/auth').send({
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

    const responseAuthor = await request(app)
      .post('/api/v1/authors')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'john green',
      })

    await request(app)
      .get('/api/v1/authors')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send()

    const response = await request(app)
      .delete(`/api/v1/authors/${responseAuthor.body.id}`)
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send()

    expect(response.status).toBe(204)
  })
})
