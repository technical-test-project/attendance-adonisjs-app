import { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import User from '#models/user'

export default class UsersController {
  /**
   * Display a list of resource
   */
  @inject()
  async index(ctx: HttpContext, _userService: UserService) {
    const users = await _userService.listOfUsers()
    return ctx.response.ok({
      message: 'success',
      data: users,
    })
  }

  /**
   * Handle form submission for the create action
   */
  @inject()
  async store(ctx: HttpContext, _userService: UserService) {
    const result = await _userService.storeUser()
    if (result instanceof User) {
      return ctx.response.created({
        message: 'User created',
        data: result,
      })
    }

    return ctx.response.internalServerError({
      message: 'Internal server error',
      errors: result,
    })
  }

  /**
   * Show individual record
   */
  @inject()
  async show(ctx: HttpContext, _userService: UserService) {
    const result = await _userService.showUser()
    return ctx.response.json({
      message: 'User exist',
      data: result,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  @inject()
  async update(ctx: HttpContext, _userService: UserService) {
    const result = await _userService.updateUser()
    if (result instanceof User) {
      return ctx.response.ok({
        message: 'User updated',
        data: result,
      })
    }

    return ctx.response.internalServerError({
      message: 'Internal server error',
      errors: result,
    })
  }

  /**
   * Delete record
   */
  @inject()
  async destroy(ctx: HttpContext, _userService: UserService) {
    const result = await _userService.deleteUser()
    if (result === true) {
      return ctx.response.ok({
        message: 'User deleted',
      })
    }

    return ctx.response.internalServerError({
      message: 'Internal server error',
      errors: result,
    })
  }
}
