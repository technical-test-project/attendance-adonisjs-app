import { inject } from '@adonisjs/core'
import ProfileService from '#services/profile_service'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ProfilesController {
  constructor(
    protected ctx: HttpContext,
    protected profileService: ProfileService
  ) {}
  async handle() {
    const profile = await this.profileService.fetchProfile()
    return this.ctx.response.json({
      profile,
    })
  }
}
