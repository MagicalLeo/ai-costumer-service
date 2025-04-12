// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/utils/email";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Check if email exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // For security reasons, always return success even if user doesn't exist
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return NextResponse.json({ code: 0, message: "Password reset email sent" });
    }

    // Generate a random token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token valid for 1 hour

    // Delete any existing reset tokens for this user
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id },
    });

    // Create new reset token
    await prisma.passwordReset.create({
      data: {
        token,
        expiresAt,
        userId: user.id,
      },
    });

    // Send password reset email
    try {
      const emailResult = await sendPasswordResetEmail(email, token, user.username);
      
      if (!emailResult.success) {
        console.error("Failed to send password reset email:", emailResult.error);
        // Still return success to client for security reasons
      } else {
        console.log(`Password reset email sent to ${email}`);
      }
    } catch (emailError) {
      console.error("Error sending password reset email:", emailError);
      // Still return success to client for security reasons
    }

    return NextResponse.json({ code: 0, message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { code: 1, message: "An error occurred" },
      { status: 500 }
    );
  }
}