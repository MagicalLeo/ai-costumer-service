// lib/auth.ts
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import * as jose from 'jose';
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// 確保JWT_SECRET從環境變量中獲取
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("警告: JWT_SECRET環境變量未設置。身份驗證將失敗！");
}

// 為JWT密鑰創建TextEncoder
const encoder = new TextEncoder();
const secretKey = JWT_SECRET ? encoder.encode(JWT_SECRET) : new Uint8Array();

// Get user from server components
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    if (!token) {
      console.log("No token found in cookies");
      return null;
    }
    
    const userId = await getUserIdFromToken(token);
    
    if (!userId) {
      console.log("Invalid or expired token");
      return null;
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Get userId from token
export async function getUserIdFromToken(token: string | undefined) {
  if (!token) {
    console.log("No token provided to getUserIdFromToken");
    return null;
  }
  
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not set, cannot verify token");
    return null;
  }
  
  try {
    // 使用jose驗證token
    const { payload } = await jose.jwtVerify(token, secretKey);
    
    if (!payload || !payload.id) {
      console.log("Token decoded but no user ID found:", payload);
      return null;
    }
    
    return payload.id as string;
  } catch (error) {
    console.error("Error verifying token:", error);
    
    // 嘗試不驗證地解碼token以幫助調試
    try {
      const decodedPayload = jose.decodeJwt(token);
      console.log("Token payload (not verified):", decodedPayload);
      
      // 檢查token是否過期
      if (decodedPayload?.exp && decodedPayload.exp * 1000 < Date.now()) {
        console.log("Token is expired. Expiration:", new Date(decodedPayload.exp * 1000));
      }
    } catch (decodeError) {
      console.error("Failed to decode token:", decodeError);
    }
    
    return null;
  }
}

// Get user ID from request (for API routes)
export function getUserIdFromRequest(request: NextRequest): string | null {
    const token = request.cookies.get("auth_token")?.value;
    
    if (!token) {
      console.log("No auth_token cookie found");
      return null;
    }
    
    try {
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not set");
      }
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Make sure decoded is an object with an id property that's a string
      if (
        !decoded || 
        typeof decoded !== 'object' || 
        !('id' in decoded) || 
        typeof decoded.id !== 'string' ||
        !decoded.id
      ) {
        console.error("Invalid token payload:", decoded);
        return null;
      }
      
      return decoded.id;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  }

// Make sure this is consistent across the application

export function createToken(userId: string, email: string) {
  if (!userId || typeof userId !== 'string') {
    console.error("Invalid userId for token creation:", userId);
    throw new Error("Invalid user ID");
  }
  
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: "7d" });
}
// Verify and parse a token
export async function verifyToken(token: string) {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not set, cannot verify token");
    return null;
  }
  
  try {
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload as { id: string; email: string };
  } catch (error) {
    console.error("Token verification failed:", error);
    
    // 嘗試不驗證地解碼token以幫助調試
    try {
      const decodedPayload = jose.decodeJwt(token);
      console.log("Token payload (not verified):", decodedPayload);
    } catch (decodeError) {
      console.error("Failed to decode token:", decodeError);
    }
    
    return null;
  }
}