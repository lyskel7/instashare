import { z } from 'zod'

export const signInSchema = z.object({
  email: z
    .string()
    .email('Type a valid email'),
  password: z
    .string()
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Z0-9]+/,
      { message: 'Password must contain at least one upper case letter, one lower case letter and one number' }
    )
    .min(6, { message: 'Password must be more than 6 characters' })
    .max(10, { message: 'Password must be less than 10 characters' })
})