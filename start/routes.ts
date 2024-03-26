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
const AuthController = () => import('#controllers/auth_controller')
const ProfilesController = () => import('#controllers/profiles_controller')

router.get('/', async () => {
  return {
    status: 'App Running',
  }
})

router
  .group(() => {
    // AuthController
    router.post('login', [AuthController])

    /**
     * Route Group by Middleware Auth Guards[api]
     */
    router
      .group(() => {
        router.get('profile', [ProfilesController])
      })
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )
  })
  .prefix('/api')
