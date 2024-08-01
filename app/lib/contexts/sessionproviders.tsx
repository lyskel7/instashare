'use client'
import { Session } from 'next-auth'
import { getSession, SessionProvider } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { ReactNode } from 'react'

const UserSessionProvider = ({ children }: { children: ReactNode }) => (
  <SessionProvider>
    {children}
  </SessionProvider>
)

export default UserSessionProvider