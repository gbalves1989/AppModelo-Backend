import { Router } from 'express'
import { app } from '../http/app'
import { userRouter } from '../../api/routes/user.routes'
import { authorRouter } from '../../api/routes/author.routes'
import { publisherRouter } from '../../api/routes/publisher.routes'
import { bookRouter } from '../../api/routes/book.routes'

const router = Router()

router.use('/api/v1/users', userRouter)
router.use('/api/v1/authors', authorRouter)
router.use('/api/v1/publishers', publisherRouter)
router.use('/api/v1/books', bookRouter)

export { router }
