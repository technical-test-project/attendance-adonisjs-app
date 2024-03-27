import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import Role from '#models/role'
import { ProfileFactory } from '#database/factories/profile_factory'
import { randomUUID } from 'node:crypto'

const roleAdmin = await Role.query().where('name', 'admin').first()
const roleEmployee = await Role.query().where('name', 'employee').first()

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      uuid: randomUUID(),
      email: faker.internet.email({
        firstName: faker.person.firstName().toLowerCase(),
        lastName: '',
        provider: 'employee.com',
      }),
      password: 'password',
    }
  })
  .state(
    'isAdmin',
    (user) => ((user.roleId = roleAdmin?.id || 1), (user.email = 'admin@admin.com'))
  )
  .state('isEmployee', (user) => (user.roleId = roleEmployee?.id || 2))
  .relation('profile', () => ProfileFactory)
  .build()
