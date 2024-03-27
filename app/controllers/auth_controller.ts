import { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'

@inject()
export default class AuthController {
  constructor(
    protected ctx: HttpContext,
    protected userService: UserService
  ) {}

  async handle() {
    const accessToken = await this.userService.authenticated()

    if (!accessToken) {
      return this.ctx.response.badRequest({
        message: 'Invalid Credentials',
      })
    }

    return this.ctx.response.ok({
      message: 'Login successfully!',
      data: accessToken,
    })
  }
}
