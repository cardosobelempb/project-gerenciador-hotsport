import { Router } from 'express'

const router = Router()

router.get('/', () => {
  return 'API is running'
})

export { router }
