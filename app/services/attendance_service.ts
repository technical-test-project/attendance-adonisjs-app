import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Attendance from '#models/attendance'
import { DateTime } from 'luxon'

@inject()
export default class AttendanceService {
  constructor(protected ctx: HttpContext) {}
  async listOfAttendance() {
    const { userId, startDate, endDate, page = 1, perPage } = this.ctx.request.qs()

    const attendanceQuery = Attendance.query()
    if (userId) {
      attendanceQuery.where('user_id', userId)
    }
    if (startDate && endDate) {
      attendanceQuery.whereRaw('DATE(created_at) BETWEEN ? AND ?', [startDate, endDate])
    } else {
      attendanceQuery.whereRaw('MONTH(created_at) = ?', [DateTime.now().month])
    }

    console.log(attendanceQuery.toSQL())

    return attendanceQuery.paginate(page, perPage)
  }

  async todayAttendance() {
    const currentUser = this.ctx?.auth?.user!
    const attendance = await Attendance.query()
      .where('user_id', currentUser.id)
      .whereRaw('DATE(created_at) = ?', [DateTime.now().toSQLDate()])
      .first()
    return {
      isClockIn: attendance?.clockIn instanceof DateTime,
      isClockOut: attendance?.clockOut instanceof DateTime,
      attendance: attendance || null,
    }
  }

  async clockIn() {
    const currentUser = this.ctx?.auth?.user!

    // Check Today Attendance
    // if not exits or null, create the attendance
    const todayAttendance = await this.todayAttendance()

    if (todayAttendance?.isClockIn) {
      return null
    }
    const attendance = await currentUser.related('attendances').create({
      clockIn: DateTime.now(),
    })
    attendance.load('user')
    return attendance
  }

  async clockOut() {
    // Check Today Attendance
    // if not exits or null, return null
    const todayAttendance = await this.todayAttendance()
    if (todayAttendance?.isClockOut) {
      return null
    }

    // Update latest attendance
    const attendance = todayAttendance.attendance
    attendance!.clockOut = DateTime.now()

    return (await attendance?.save()) || null
  }
}
