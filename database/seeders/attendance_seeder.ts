import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import Attendance from '#models/attendance'

export default class extends BaseSeeder {
  static environment = ['development', 'testing']
  async run() {
    // Write your database queries inside the run method
    const start = DateTime.fromISO('2024-03-01')
    const end = DateTime.fromISO('2024-03-10')
    const numbers = [1, 2, 3, 4, 5]
    for (let i = 0, date = start; date <= end; date = date.plus({ day: 1 })) {
      let randomNumber = Math.floor(Math.random() * numbers.length) + 1
      let status = Attendance.CLOCK_IN
      let clockAt = date.plus({ hour: randomNumber, minute: randomNumber, second: randomNumber })
      if (i % 2 === 0) {
        status = Attendance.CLOCK_OUT
        clockAt = clockAt.plus({ hour: 5, minute: 5 })
      }
      await Attendance.create({
        userId: randomNumber,
        status: status,
        clockAt: clockAt,
        createdAt: date,
        updatedAt: date,
      })
    }
  }
}
