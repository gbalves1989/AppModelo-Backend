import request from 'supertest'
import { app } from '../../shared/http/app'

describe('Teste nas rotas de editores', () => {
  test('Editor criado com sucesso.', async () => {
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
      .post('/api/v1/publishers')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'editora abril',
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('editora abril')
  })

  test('Editora encontrada com sucesso.', async () => {
    const responseToken = await request(app).post('/api/v1/users/auth').send({
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

    const responsePublisher = await request(app)
      .post('/api/v1/publishers')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'editora epoca',
      })

    const response = await request(app)
      .get(`/api/v1/publishers/${responsePublisher.body.id}`)
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send()

    expect(response.status).toBe(200)
  })

  test('Lista de editoras retornada com sucesso.', async () => {
    const responseToken = await request(app).post('/api/v1/users/auth').send({
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

    await request(app)
      .post('/api/v1/publishers')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'editora abril',
      })

    const response = await request(app)
      .get('/api/v1/publishers')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send()

    expect(response.status).toBe(200)
  })

  test('Editora atualizada com sucesso.', async () => {
    const responseToken = await request(app).post('/api/v1/users/auth').send({
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

    const responsePublisher = await request(app)
      .post('/api/v1/publishers')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'editora abril',
      })

    const response = await request(app)
      .patch(`/api/v1/publishers/${responsePublisher.body.id}`)
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'editora maio',
      })

    expect(response.status).toBe(200)
  })

  test('Editora deletada com sucesso.', async () => {
    const responseToken = await request(app).post('/api/v1/users/auth').send({
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

    const responsePublisher = await request(app)
      .post('/api/v1/publishers')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'editora abril',
      })

    const response = await request(app)
      .delete(`/api/v1/publishers/${responsePublisher.body.id}`)
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send()

    expect(response.status).toBe(204)
  })
})
