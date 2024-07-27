import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import Google from "next-auth/providers/google"

// const prismaSingleton = () => (new PrismaClient())

let prismaClient: PrismaClient

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithPrisma = global as typeof globalThis & {
    _prismaClient?: PrismaClient
  }

  if (!globalWithPrisma._prismaClient) {
    globalWithPrisma._prismaClient = new PrismaClient()
  }

  prismaClient = globalWithPrisma._prismaClient
} else {
  // In production mode, it's best to not use a global variable.
  prismaClient = new PrismaClient()
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prismaClient),
  providers: [Google],
})

export default prismaClient