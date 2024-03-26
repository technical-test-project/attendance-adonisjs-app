import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'

export default class extends BaseSeeder {
  static environment = ['development', 'testing']
  async run() {
    // Write your database queries inside the run method
    const roleData = [
      {
        name: 'admin',
      },
      {
        name: 'employee',
      },
    ]

    await Role.createMany(
      roleData.map((role) => ({
        ...role,
      }))
    )
  }
}
