import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { loginValidator } from '#validators/user_validator'

@inject()
export default class UserService {
  constructor(protected ctx: HttpContext) {}

  async authenticated() {
    const { email, password } = await this.ctx.request.validateUsing(loginValidator)

    /**
     * Find a user by email. Return error if a user does
     * not exist
     */
    const findByEmail = User.findBy('email', email)
    if (!findByEmail) {
      return null
    }

    const user = await findByEmail

    /**
     * Verify the password using the hash service
     */
    const isVerified = await hash.verify(user!.password, password)
    if (isVerified) {
      return await User.accessTokens.create(user!)
    }
  }

  async fetchUserProfile() {
    // const userAuth = this.ctx.auth?.user

    const user = this.ctx?.auth?.user
    user?.serialize()
    await user?.load('profile')
    return user
  }
}
