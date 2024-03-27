import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, scope } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Role from '#models/role'

export default class Attendance extends BaseModel {
  static table: string = 'attendances'

  /**
   * Scopes
   */
  static filterByCurrentUser = scope(async (query, user: User) => {
    // When is admin not used QueryScope
    // When is employee filtered by user.roleId
    await user.load('role')
    if (user.role.name !== 'admin') {
      query.whereHas('user', (builder) => {
        builder.where('role_id', user.roleId)
      })
    }
  })

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare clockIn: DateTime

  @column.dateTime()
  declare clockOut: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
