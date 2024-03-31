// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import Position from '#models/position'

@inject()
export default class PositionsController {
  constructor(protected ctx: HttpContext) {}

  async handle() {
    const positions = await Position.all()

    return this.ctx.response.ok({
      message: 'success',
      data: positions,
    })
  }
}
