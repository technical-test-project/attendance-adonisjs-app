import User from '#models/user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ProfileService {
  constructor(protected ctx: HttpContext) {}
  async fetchProfile() {
    // const userAuth = this.ctx.auth?.user

    const user = await User.find(1)
    await user?.serialize()
    await user?.load('profile')
    return user
  }
}
