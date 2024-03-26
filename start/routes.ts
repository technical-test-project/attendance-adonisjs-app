/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const ProfilesController = () => import('#controllers/profiles_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/profile', [ProfilesController]).use(
  middleware.auth({
    guards: ['api'],
  })
)
