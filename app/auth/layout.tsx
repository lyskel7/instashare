'use client'
import React, { ReactNode } from 'react'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-full items-center justify-center">
      <div className="flex flex-col item-center rounded-lg bg-slate-800 w-80 py-2 px-8 pb-8 space-y-2 my-2">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout