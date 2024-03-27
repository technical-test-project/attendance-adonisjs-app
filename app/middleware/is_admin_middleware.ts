import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Role from '#models/role'

export default class IsAdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const currentUser = ctx.auth?.user!
    await currentUser.load('role')
    const roleAdmin = await Role.findBy('name', 'admin')

    if (currentUser.role.name !== roleAdmin?.name) {
      return ctx.response.forbidden({
        errors: [
          {
            message: 'Forbidden Access',
          },
        ],
      })
    }

    return await next()
  }
}
