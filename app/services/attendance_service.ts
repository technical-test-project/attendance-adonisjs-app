import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Attendance from '#models/attendance'
import { DateTime } from 'luxon'
import Role from '#models/role'

@inject()
export default class AttendanceService {
  constructor(protected ctx: HttpContext) {}
  async listOfAttendance() {
    // const { page = 1, perPage = 100, startDate, endDate } = this.ctx.request.qs()
    const { startDate, endDate } = this.ctx.request.qs()

    const attendanceQuery = Attendance.query()

    // Filter by default auth role
    const currentUser = this.ctx.auth?.user!
    await currentUser.preload('role')

    if (currentUser.role.name !== Role.ADMIN) {
      attendanceQuery.whereHas('user', (query) => {
        query.where('id', currentUser.id)
      })
    }

    if (startDate && endDate) {
      attendanceQuery.whereRaw('DATE(created_at) BETWEEN ? AND ?', [startDate, endDate])
    } else {
      attendanceQuery.whereRaw('MONTH(created_at) = ?', [DateTime.now().month])
    }

    // Preload relationships
    attendanceQuery.preload('user', (userQuery) => {
      userQuery.preload('profile')
    })

    console.log(attendanceQuery.toQuery())
    const attendances = await attendanceQuery.orderBy('created_at', 'desc')

    // const paginate = await attendanceQuery.paginate(page, perPage)
    // return paginate.serialize()

    return {
      data: attendances,
    }
  }

  private async todayAttendanceByStatus(status: string) {
    const currentUser = this.ctx?.auth?.user!

    return await Attendance.query()
      .where('user_id', currentUser.id)
      .where('status', status)
      .whereRaw('DATE(created_at) = ?', [DateTime.now().toSQLDate()])
      .first()
  }

  async todayAttendance() {
    const attendanceClockIn = await this.todayAttendanceByStatus(Attendance.CLOCK_IN)
    const attendanceClockOut = await this.todayAttendanceByStatus(Attendance.CLOCK_OUT)

    return {
      isClockIn:
        attendanceClockIn?.clockAt instanceof DateTime &&
        attendanceClockIn.status === Attendance.CLOCK_IN,
      isClockOut:
        attendanceClockOut?.clockAt instanceof DateTime &&
        attendanceClockOut.status === Attendance.CLOCK_OUT,
    }
  }

  async clockIn() {
    const currentUser = this.ctx?.auth?.user!

    // Check Today Attendance for 1 attempt ClockIn
    // if not exits or null, create the attendance
    const todayAttendance = await this.todayAttendance()

    // If exits return to null
    if (todayAttendance?.isClockIn) {
      return null
    }
    // Create attendance for ClockIn
    const attendance = await currentUser.related('attendances').create({
      status: Attendance.CLOCK_IN,
    })
    attendance.load('user')
    return attendance
  }

  async clockOut() {
    const currentUser = this.ctx?.auth?.user!
    const todayAttendance = await this.todayAttendance()

    // If today has not ClockIn, then return null
    if (!todayAttendance?.isClockIn) {
      return {
        message: 'Please Clock in first!',
      }
    }

    // Check Today Attendance for 1 attempt ClockOut
    // if not exits or null, return null
    if (todayAttendance?.isClockOut) {
      return {
        message: 'Only 1 attempt for ClockOut today',
      }
    }

    // Create attendance for ClockOut
    const newAttendance = await currentUser.related('attendances').create({
      status: Attendance.CLOCK_OUT,
    })
    newAttendance.load('user')

    return newAttendance || null
  }
}
