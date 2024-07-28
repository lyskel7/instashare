'use client'
import React, { ReactNode } from 'react'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col item-center rounded-lg border border-gray-400 bg-neutral-800/60 w-80 py-2 px-8 pb-8 space-y-2 my-2">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout