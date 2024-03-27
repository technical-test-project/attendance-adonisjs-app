import vine from '@vinejs/vine'
import User from '#models/user'

const loginSchema = vine.object({
  email: vine.string().trim().email(),
  password: vine.string(),
})

const createUserSchema = vine.object({
  roleId: vine.number(),
  positionId: vine.number().nullable().optional(),
  email: vine
    .string()
    .trim()
    .email()
    .unique(async (_db, value, _field) => {
      const user = await User.findBy('email', value)
      return !user
    }),
  password: vine.string(),
  name: vine.string().trim(),
  phone: vine.string().minLength(11),
  photo: vine
    .file({
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png'],
    })
    .nullable()
    .optional(),
})

const updateUserSchema = vine.object({
  roleId: vine.number().optional(),
  positionId: vine.number().nullable().optional(),
  email: vine
    .string()
    .trim()
    .email()
    .unique(async (_db, value, _field) => {
      const user = await User.query()
        .where('email', value)
        .whereNot('id', _field.data.params.id)
        .first()
      return !user
    })
    .optional(),
  password: vine.string().optional(),
  name: vine.string().trim().optional(),
  phone: vine.string().minLength(11).optional(),
  photo: vine
    .file({
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png'],
    })
    .nullable()
    .optional(),
})

export const loginValidator = vine.compile(loginSchema)
export const createUserValidator = vine.compile(createUserSchema)
export const updateUserValidator = vine.compile(updateUserSchema)
