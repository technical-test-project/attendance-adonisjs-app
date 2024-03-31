import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import Attendance from '#models/attendance'

export default class extends BaseSeeder {
  static environment = ['development', 'testing']
  async run() {
    // Write your database queries inside the run method
    const start = DateTime.now().minus({ years: 5 }).startOf('month')
    const end = DateTime.now().endOf('month')
    const numbers = [1, 2, 3, 4, 5]

    for (let date = start; date <= end; date = date.plus({ day: 1 })) {
      let randomNumber = Math.floor(Math.random() * numbers.length) + 1
      let clockAt = date.plus({ hour: randomNumber, minute: randomNumber, second: randomNumber })

      await Attendance.create({
        userId: randomNumber,
        status: Attendance.CLOCK_IN,
        clockAt: clockAt,
        createdAt: date,
        updatedAt: date,
      })

      await Attendance.create({
        userId: randomNumber,
        status: Attendance.CLOCK_OUT,
        clockAt: clockAt.plus({ hour: 5, minute: 5 }),
        createdAt: date,
        updatedAt: date,
      })
    }
  }
}
