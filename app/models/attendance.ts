import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Attendance extends BaseModel {
  static table: string = 'attendances'
  static CLOCK_IN = 'clock_in'
  static CLOCK_OUT = 'clock_out'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare clockAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
