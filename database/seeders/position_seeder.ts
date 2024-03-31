import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Position from '#models/position'

export default class extends BaseSeeder {
  static environment = ['development', 'testing']
  async run() {
    // Write your database queries inside the run method
    const positionData = [
      {
        name: 'Manager',
      },
      {
        name: 'Tech Lead',
      },
      {
        name: 'HRD',
      },
      {
        name: 'Backend Developer',
      },
      {
        name: 'FrontEnd Developer',
      },
      {
        name: 'UI/UX Designer',
      },
      {
        name: 'System Analyst',
      },
      {
        name: 'Data Engineer',
      },
    ]

    await Position.createMany(
      positionData.map((row) => ({
        ...row,
      }))
    )
  }
}
