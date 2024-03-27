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
const AttendancesController = () => import('#controllers/attendances_controller')
const UsersController = () => import('#controllers/users_controller')
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
        /**
         * API Profile
         */
        router.get('profile', [ProfilesController])

        /**
         * API Users
         */
        router.resource('users', UsersController).apiOnly()

        /**
         * API Attendances
         */
        router
          .group(() => {
            router.get('/', [AttendancesController, 'index'])
            router.get('/today', [AttendancesController, 'today'])
            router.post('clock-in', [AttendancesController, 'clockIn'])
            router.post('clock-out', [AttendancesController, 'clockOut'])
          })
          .prefix('attendances')
      })
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )
  })
  .prefix('/api')
