// app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    // Find the password reset record
    const passwordReset = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    // Check if token exists and is not expired
    if (!passwordReset || passwordReset.expiresAt < new Date()) {
      return NextResponse.json(
        { code: 1, message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await prisma.user.update({
      where: { id: passwordReset.userId },
      data: { password: hashedPassword },
    });

    // Delete the password reset token
    await prisma.passwordReset.delete({
      where: { id: passwordReset.id },
    });

    return NextResponse.json({ code: 0, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { code: 1, message: "An error occurred" },
      { status: 500 }
    );
  }
}