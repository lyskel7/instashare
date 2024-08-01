'use client'
import { signInSchema } from '@/app/lib/validators/zod/schema.signin'
import { Button, Field, Input, Label } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import clsx from 'clsx'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FieldError, useForm } from 'react-hook-form'

const inputStyle = clsx(
  'block w-full rounded-lg border-none bg-white/70 py-1.5 px-3 text-sm/6  text-slate-900',
  'w-full focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-slate-900/25'
)

type TFormInput = {
  email: string;
  password: string;
}

const messageError = (field: FieldError) => (
  <span className='text-red-500 text-xs'>{field && field.message}</span>
)

const SignInPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<TFormInput>({ resolver: zodResolver(signInSchema) });
  const router = useRouter();
  const [error, setError] = useState('');

  const handleOnSubmit = async (data: TFormInput) => {
    const { email, password } = data;
    const res = await signIn('credentials', {
      email: email,
      password: password,
      redirect: false,
    },)
    if (res?.error) {
      setError('Invalid credentials')
    } else {
      router.push('/dashboard/user')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="flex flex-col item-center gap-1">
        {
          error && <p className='bg-red-500 text-xs text-white p-1 rounded-md'>{error}</p>
        }
        <Field>
          <Label className="text-sm/6 font-medium text-white">Email</Label>
          <Input
            className={inputStyle}
            type='email'
            {...register('email')}
          />
          {messageError(errors.email!)}
        </Field>

        <Field>
          <Label className="text-sm/6 font-medium text-white">Password</Label>
          <Input
            className={inputStyle}
            type='password'
            {...register('password')}
          />
          {messageError(errors.password!)}
        </Field>

        <Button
          type='submit'
          className="rounded bg-sky-500 py-2 px-4 my-2 text-sm text-white data-[hover]:bg-sky-500 data-[hover]:data-[active]:bg-sky-700"
        >
          <div className='flex flex-row items-center'>
            {
              isSubmitting &&
              <svg className="items-start animate-spin h-5 w-5 mr-3 border-2 rounded-full border-white border-t-teal-950" />
            }
            <span className={clsx(isSubmitting && 'pl-14', !isSubmitting && 'flex-auto')}>{isSubmitting ? 'Processing...' : 'Sign in'}</span>
          </div>
        </Button>

        <span className='text-white text-xs text-center'>
          If you haven´t an account, please <br />
          <Link
            href={'/auth/signup'}
            className='underline underline-offset-4 text-sky-500'
          >
            Sign up
          </Link>
        </span>
      </div>
    </form>
  )
}

export default SignInPage