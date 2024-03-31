import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'

@inject()
export default class ProfilesController {
  constructor(
    protected ctx: HttpContext,
    protected userService: UserService
  ) {}

  async profile() {
    const profile = await this.userService.fetchUserProfile()

    return this.ctx.response.ok({
      message: 'success',
      data: profile,
    })
  }

  async updateProfile() {
    const profile = await this.userService.updateUser()

    return this.ctx.response.ok({
      message: 'success',
      data: profile,
    })
  }
}
