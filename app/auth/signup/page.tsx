'use client'
import { SignupController } from '@/app/lib/controllers/SignupControler'
import { EAuthType } from '@/app/lib/enums'
import { TUser } from '@/app/lib/types'
import { signUpSchema } from '@/app/lib/validators/zod'
import { Button, Field, Input, Label } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FieldError, useForm } from 'react-hook-form'

const inputStyle = clsx(
  'block w-full rounded-lg border-none bg-white/70 py-1.5 px-3 text-sm/6  text-slate-900',
  'w-full focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-slate-900/25'
)

type TFormInput = TUser & { confirm: string }

const messageError = (field: FieldError) => (
  <span className='text-red-500 text-xs'>{field && field.message}</span>
)

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<TFormInput>({ resolver: zodResolver(signUpSchema) });
  const router = useRouter();

  const handleOnSubmit = async (data: TFormInput) => {
    try {
      const { confirm, ...user } = data;
      await SignupController.getSignupControllerInstance(EAuthType.NONE).signup(user);
      router.push('/auth/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { data } = error.response;
          console.log('popup error: ', data['message']);

          // alert(`Error: ${error.response.data.message}`);
        } else if (error.request) {
          // 'Error: No response received from server'
          console.error(`Error: ${error.request}`);
        }
      } else {
        // General AxiosError
        // alert(`Error: ${(error as Error).message}`);
        console.error('popup error: ', (error as Error).message);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="flex flex-col item-center gap-1">
        <Field>
          <Label className="text-sm/6 font-medium text-white">Full name</Label>
          <Input
            className={inputStyle}
            {...register('name')}
          />
          {messageError(errors.name!)}
        </Field>

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
          <Label className="text-sm/6 font-medium text-white">Mobile</Label>
          <Input
            className={inputStyle}
            type='tel'
            {...register('mobile')}
          />
          {messageError(errors.mobile!)}
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

        <Field>
          <Label className="text-sm/6 font-medium text-white">Confirm password</Label>
          <Input
            className={inputStyle}
            type='password'
            {...register('confirm')}
          />
          {messageError(errors.confirm!)}
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
            <span className={clsx(isSubmitting && 'pl-14', !isSubmitting && 'flex-auto')}>{isSubmitting ? 'Processing...' : 'Sign up'}</span>
          </div>
        </Button>

        <span className='text-white text-xs text-center'>
          If you have an account, please <br />
          <Link
            href={'/auth/signin'}
            className='underline underline-offset-4 text-sky-500'
          >
            Sign in
          </Link>
        </span>
      </div>
    </form>
  )
}

export default SignUpPage