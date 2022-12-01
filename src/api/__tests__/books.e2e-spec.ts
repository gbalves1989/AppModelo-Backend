import request from 'supertest'
import { app } from '../../shared/http/app'

describe('Teste nas rotas de livros', () => {
  test('Livro criado com sucesso.', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'gabriel alves',
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

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

    const responsePublisher = await request(app)
      .post('/api/v1/publishers')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'editora abril',
      })

    const response = await request(app)
      .post('/api/v1/books')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        title: 'livro teste',
        year: '2022',
        authorId: responseAuthor.body.id,
        publisherId: responsePublisher.body.id,
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.title).toBe('livro teste')
    expect(response.body.year).toBe('2022')
  })

  test('Livro encontrado com sucesso.', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'gabriel alves',
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

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

    const responsePublisher = await request(app)
      .post('/api/v1/publishers')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'editora abril',
      })

    const responseBook = await request(app)
      .post('/api/v1/books')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        title: 'livro teste',
        year: '2022',
        authorId: responseAuthor.body.id,
        publisherId: responsePublisher.body.id,
      })

    const response = await request(app)
      .get(`/api/v1/books/${responseBook.body.id}`)
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send()

    expect(response.status).toBe(200)
  })

  test('Lista de livros encontrado com sucesso.', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'gabriel alves',
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

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

    const responsePublisher = await request(app)
      .post('/api/v1/publishers')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'editora abril',
      })

    await request(app)
      .post('/api/v1/books')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        title: 'livro teste',
        year: '2022',
        authorId: responseAuthor.body.id,
        publisherId: responsePublisher.body.id,
      })

    const response = await request(app)
      .get('/api/v1/books')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send()

    expect(response.status).toBe(200)
  })

  test('Livro atualizado com sucesso.', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'gabriel alves',
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

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

    const responsePublisher = await request(app)
      .post('/api/v1/publishers')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'editora abril',
      })

    const responseBook = await request(app)
      .post('/api/v1/books')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        title: 'livro teste',
        year: '2022',
        authorId: responseAuthor.body.id,
        publisherId: responsePublisher.body.id,
      })

    const response = await request(app)
      .patch(`/api/v1/books/${responseBook.body.id}`)
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        title: 'livro teste 2',
        year: '2023',
      })

    expect(response.status).toBe(200)
    expect(response.body.title).toBe('livro teste 2')
    expect(response.body.year).toBe('2023')
  })

  test('Livro deletado com sucesso.', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'gabriel alves',
      email: 'gabriel@gmail.com',
      password: 'gabriel1989',
    })

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

    const responsePublisher = await request(app)
      .post('/api/v1/publishers')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        name: 'editora abril',
      })

    const responseBook = await request(app)
      .post('/api/v1/books')
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send({
        title: 'livro teste',
        year: '2022',
        authorId: responseAuthor.body.id,
        publisherId: responsePublisher.body.id,
      })

    const response = await request(app)
      .delete(`/api/v1/books/${responseBook.body.id}`)
      .set('Authorization', `Bearer ${responseToken.body.token}`)
      .send()

    expect(response.status).toBe(204)
  })
})
