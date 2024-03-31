import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'

export default class extends BaseSeeder {
  private async seed(Seeder: { default: typeof BaseSeeder }) {
    /**
     * Do not run when not in a environment specified in Seeder
     */
    if (
      !Seeder.default.environment ||
      (!Seeder.default.environment.includes('development') && app.inDev) ||
      (!Seeder.default.environment.includes('testing') && app.inTest) ||
      (!Seeder.default.environment.includes('production') && app.inProduction)
    ) {
      return
    }

    await new Seeder.default(this.client).run()
  }
  async run() {
    // Write your database queries inside the run method

    await this.seed(await import('#database/seeders/role_seeder'))
    await this.seed(await import('#database/seeders/position_seeder'))
    await this.seed(await import('#database/seeders/user_seeder'))
    await this.seed(await import('#database/seeders/attendance_seeder'))
  }
}
