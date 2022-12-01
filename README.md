# AppModelo-Backend
- Typescript
- Redis
- Swagger
- RateLimit
- ExpressJS
- Prisma
- Jest -> Testes em e2e

- Configurar arquivo .env.example

- instalar as libs do package.json
npm i

- rodar a migração do prisma
npx prisma migrate dev

- rodar o server
npm run start

- para verificar a documentação da api 
ex: http://localhost:3333/docs

- para acompanhar em tempo real as informações no redis
- instalar o docker em sua maquina e executar os seguintes comandos
docker run --name redis -p 6379:6379 -d -t redis:alpine
docker run --name redis-client -v redisinsight:/db -p 8001:8001 -d -t redislabs/redisinsight:latest

- link para verificar as informações de cache do redis
ex: http://localhost:8001

- para executar os testes (comandos via "scripts" do package.json)
npm run test:e2e:users
npm run test:e2e:authors
npm run test:e2e:publishers
npm run test:e2e:books

