import { adaptRouteExpress as adapt } from '@/main/adapters'
import { Router } from 'express'

import { makeFacebookLoginController } from '../factories/controllers'

export default (router: Router): void => {
  router.post('/login/facebook', adapt(makeFacebookLoginController()))
}
