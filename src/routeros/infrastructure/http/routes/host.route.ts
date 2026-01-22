import { Router } from 'express'

import { createHostController } from '../controllers/create-host.controller'

const routerHost = Router()

routerHost.post('/', createHostController)

export { routerHost }
