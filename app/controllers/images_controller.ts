import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import app from '@adonisjs/core/services/app'

@inject()
export default class ImagesController {
  constructor(protected ctx: HttpContext) {}

  async handle() {
    const { subfolder } = this.ctx.request.qs()
    const { filename } = this.ctx.params

    const filePath = subfolder ? `${subfolder}/${filename}` : filename
    const publicPath = app.publicPath(filePath)

    return this.ctx.response.download(publicPath)
  }
}
