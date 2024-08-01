'use client'
import { signOut } from 'next-auth/react'
import { Button, Dialog, DialogPanel, Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import google from 'next-auth/providers/google'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const Navbar = () => {
  const { data } = useSession();
  const pathname = usePathname();

  return (
    <header className="bg-slate-900 text-white inset-x-0 top-0 z-50 sticky">
      <nav aria-label="Navbar" className="flex items-center justify-between pr-2">
        <div className="flex lg:flex-1">
          <Image
            alt=""
            src="/logo/instashare.png"
            className="w-auto"
            width={80}
            height={60}
          />
        </div>

        {
          !data?.user ?
            <div className='flex flex-row justify-center border rounded-lg h-10'>
              <div className='px-2 flex flex-col justify-center cursor-pointer hover:underline underline-offset-4 rounded-r-lg'>
                <Link href={'/auth/signin'}>
                  <span>Sign in</span>
                </Link>
              </div>
              <div className='bg-sky-700 px-2 flex flex-col justify-center cursor-pointer hover:underline underline-offset-4 rounded-r-lg'>
                <Link href={'/auth/signup'}>
                  <span>Sign up</span>
                </Link>
              </div>
            </div>
            :
            <Button onClick={() => signOut({ callbackUrl: '/', })}>
              Sign out
            </Button>
        }
      </nav>
    </header>
  )
}

export default Navbar