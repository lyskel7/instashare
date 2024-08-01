// export { auth as middleware } from "@/auth"
import { auth } from '@/auth';
import { ERole } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const basePath = req.nextUrl.basePath;

  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL('/auth/signin', basePath));
  }

  const { role } = session.user;
  const adminRoutes = ['/dashboard/:path*'];
  const userRoutes = ['/dashboard/user'];

  console.log('user en middleware:', role)

  const currentPath = req.nextUrl.pathname;
  console.log('user en curentpath:', currentPath)
  console.log('user include :', userRoutes.includes(currentPath))

  if (role === ERole.USER && !userRoutes.includes(currentPath)) {
    console.log('entro en redirect a error')
    return NextResponse.redirect(new URL('/dashboard/user', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
}