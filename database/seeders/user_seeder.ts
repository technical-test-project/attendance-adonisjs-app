import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#database/factories/user_factory'
import Position from '#models/position'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method

    for (const position of await Position.all()) {
      await UserFactory.apply('isEmployee')
        .with('profile', 1)
        .merge({ positionId: position.id })
        .create()
    }

    await UserFactory.apply('isAdmin').with('profile', 1).create()
  }
}
