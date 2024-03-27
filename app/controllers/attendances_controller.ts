import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import AttendanceService from '#services/attendance_service'
import Attendance from '#models/attendance'

export default class AttendancesController {
  /**
   * Display a list of resource
   */
  @inject()
  async index(ctx: HttpContext, _attendanceService: AttendanceService) {
    const result = await _attendanceService.listOfAttendance()
    return ctx.response.ok({
      message: 'success',
      ...result.toJSON(),
    })
  }

  @inject()
  async today(ctx: HttpContext, _attendanceService: AttendanceService) {
    const result = await _attendanceService.todayAttendance()
    return ctx.response.ok({
      message: 'success',
      data: result,
    })
  }

  @inject()
  async clockIn(ctx: HttpContext, _attendanceService: AttendanceService) {
    const result = await _attendanceService.clockIn()
    if (result instanceof Attendance) {
      return ctx.response.ok({
        message: 'Clock in successfully',
        data: result,
      })
    }

    return ctx.response.unprocessableEntity({
      errors: [
        {
          message: 'Today clock in already exists',
        },
      ],
    })
  }

  @inject()
  async clockOut(ctx: HttpContext, _attendanceService: AttendanceService) {
    const result = await _attendanceService.clockOut()
    if (result instanceof Attendance) {
      return ctx.response.ok({
        message: 'Clock out successfully',
        data: result,
      })
    }
    return ctx.response.unprocessableEntity({
      errors: [
        {
          message: 'Please Clock in first!',
        },
      ],
    })
  }

  // /**
  //  * Handle form submission for the create action
  //  */
  // async store({ request }: HttpContext) {}
  //
  // /**
  //  * Show individual record
  //  */
  // async show({ params }: HttpContext) {}
  //
  // /**
  //  * Handle form submission for the edit action
  //  */
  // async update({ params, request }: HttpContext) {}
  //
  // /**
  //  * Delete record
  //  */
  // async destroy({ params }: HttpContext) {}
}
