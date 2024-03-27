import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import {
  createUserValidator,
  loginValidator,
  updateUserValidator,
} from '#validators/user_validator'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import Profile from '#models/profile'
import { randomUUID } from 'node:crypto'

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
    await user?.load('profile')
    return user
  }

  async listOfUsers() {
    const users: User[] = await User.query().preload('profile')
    return users
  }

  async storeUser() {
    const payload = await this.ctx.request.validateUsing(createUserValidator)

    const trx = await db.transaction()
    try {
      // Create a new user instance
      const user = await User.create({
        uuid: randomUUID(),
        roleId: payload.roleId,
        positionId: payload.positionId || null,
        email: payload.email,
        password: payload.password,
      })

      // Store Photo
      await payload.photo?.move(app.publicPath(User.table), {
        name: `${user.uuid}.jpg`,
        overwrite: true,
      })

      // Create a new profile instance
      await user.related('profile').create({
        name: payload.name,
        phone: payload.phone,
        photoUrl: payload.photo?.fileName || null,
      })

      await trx.commit()

      return user
    } catch (error) {
      await trx.rollback()
      console.error('Error creating user :', error.message)
      return error
    }
  }

  async showUser() {
    return await User.query().preload('profile').where('id', this.ctx.params.id).first()
  }

  async updateUser() {
    const payload = await this.ctx.request.validateUsing(updateUserValidator)

    const user = await User.findOrFail(this.ctx.params.id)

    const trx = await db.transaction()
    try {
      // Update a new user instance
      user.roleId = payload.roleId || user.roleId
      user.positionId = payload.positionId || user?.positionId
      user.email = payload.email || user.email
      user.password = payload.password || user.password
      await user.save()

      // Store Photo
      await payload.photo?.move(app.publicPath(User.table), {
        name: `${user.uuid}.jpg`,
        overwrite: true,
      })

      // Update a new profile instance
      const profile = await Profile.find(user.id)
      profile!.name = payload.name || user.profile.name
      profile!.phone = payload.phone || user.profile?.phone
      profile!.photoUrl = payload.photo?.fileName || user.profile?.photoUrl

      await profile?.save()

      await trx.commit()

      return user
    } catch (error) {
      await trx.rollback()
      console.error('Error creating user :', error.message)
      return error
    }
  }

  async deleteUser() {
    const user = await User.findOrFail(this.ctx.params.id)

    const trx = await db.transaction()
    try {
      await user.delete()

      await trx.commit()

      return true
    } catch (error) {
      await trx.rollback()
      console.error('Error deleting user :', error.message)

      return error
    }
  }
}
