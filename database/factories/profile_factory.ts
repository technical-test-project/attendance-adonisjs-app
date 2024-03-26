import factory from '@adonisjs/lucid/factories'
import Profile from '#models/profile'

export const ProfileFactory = factory
  .define(Profile, async ({ faker }) => {
    const randomNumber = faker.number.int({ min: 10, max: 99 })

    return {
      name: faker.person.firstName(),
      phone: `0821234567${randomNumber}`,
    }
  })
  .build()
