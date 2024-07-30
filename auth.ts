import NextAuth, { CredentialsSignin } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { compare } from 'bcrypt'
import { Provider } from "next-auth/providers"

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

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid credentials"
}

interface ICredentials {
  email: string,
  password: string
}

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    authorize: async (credentials) => {
      try {
        if (!credentials) {
          throw new InvalidLoginError();
        }

        const { email, password } = credentials as ICredentials;

        const user = await prismaClient.user.findUnique({
          where: {
            email: email,
          }
        });

        if (!user) {
          throw new InvalidLoginError();
        }

        const matchedPassword = await compare(password, user.password!);

        if (!matchedPassword) {
          throw new InvalidLoginError();
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      } catch (error) {
        console.error('Error in authorize function:', error);
        return null;
      }
    },
  }),
  Google
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prismaClient),
  providers,
  pages: {
    signIn: '/auth/signin'
  }
})

export default prismaClient
