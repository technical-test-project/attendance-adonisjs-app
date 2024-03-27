import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'

@inject()
export default class ProfilesController {
  constructor(
    protected ctx: HttpContext,
    protected userService: UserService
  ) {}

  async handle() {
    const profile = await this.userService.fetchUserProfile()

    return this.ctx.response.ok({
      message: 'success',
      data: profile,
    })
  }
}
