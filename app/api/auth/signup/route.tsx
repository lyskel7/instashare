import { TUser } from "@/app/lib/types";
import prismaClient from "@/auth";
import { hash } from 'bcryptjs';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data: TUser = await req.json();

    //Checking if email exist 
    const matchedEmail = await prismaClient.user.findUnique({
      where: {
        email: data.email
      },
      select: {
        email: true
      }
    })

    if (matchedEmail) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
    }

    //Encryting password
    const encryptedPass = await hash(data.password, 10);
    await prismaClient.user.create({
      data: {
        ...data,
        password: encryptedPass
      }
    });

  } catch (error) {
    return NextResponse.json(error);
  }
  return NextResponse.json(true);
}