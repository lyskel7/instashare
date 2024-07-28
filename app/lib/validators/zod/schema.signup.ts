import { z } from 'zod'

export const signUpSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: "Name must be a string",
    })
    .refine(val => (val.length >= 1 && val.length <= 50),
      { message: 'Full name is required' }),
  email: z
    .string()
    .email('Type a valid email'),
  mobile: z
    .string()
    .regex(/^[0-9-]{6,15}$/, {
      message: 'Mobile must be numbers between 6 and 15 chars including -'
    }),
  password: z
    .string()
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Z0-9]+/,
      { message: 'Password must contain at least one upper case letter, one lower case letter and one number' }
    )
    .min(6, { message: 'Password must be more than 6 characters' })
    .max(10, { message: 'Password must be less than 10 characters' }),
  confirm: z
    .string()
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Z0-9]+/,
      { message: 'Password must contain at least one upper case letter, one lower case letter and one number' }
    )
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(10, { message: 'Password cannot be longer than 10 characters' })
}).refine(data => data.password === data.confirm,
  { message: 'Password do not match', path: ['confirm'] })
