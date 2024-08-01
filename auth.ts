import { PrismaAdapter } from "@auth/prisma-adapter"
import { ERole, PrismaClient } from "@prisma/client"
import { compare } from 'bcryptjs'
import NextAuth, { CredentialsSignin } from "next-auth"
import { Provider } from "next-auth/providers"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

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

let roleToStore: ERole = ERole.USER;

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
        console.log('callback: ', user.id)
        console.log('callback: ', user.name)
        console.log('callback: ', user.email)

        roleToStore = user.role;

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

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prismaClient),
  providers,
  pages: {
    signIn: '/auth/signin'
  },
  session: { strategy: 'jwt' },
  callbacks: {
    authorized: async ({ auth }) => {
      console.log('authorize: ', auth)
      return !!auth?.user
    },
    async jwt({ token, user }) {
      // console.log('token strategy: ', token)
      // console.log('token user: ', user)
      if (user) token.role = roleToStore;
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role;
      }
      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
})

export default prismaClient
