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
      let userId = Math.floor(Math.random() * numbers.length) + 1
      let status = Attendance.CLOCK_IN
      let clockAt = DateTime.now().plus({ day: 1, minute: 5 })
      if (i % 2 === 0) {
        status = Attendance.CLOCK_OUT
        clockAt = DateTime.now().plus({ day: 1, hour: 5, minute: 5 })
      }
      await Attendance.create({
        userId: userId,
        status: status,
        clockAt: clockAt,
      })
    }
  }
}
