import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signAdminToken, COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف'),
});

// Simple in-memory rate limit for login attempts (IP -> { count, lockedUntil })
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();

    // Check rate limit
    const attempt = loginAttempts.get(ip);
    if (attempt && attempt.lockedUntil > now) {
      const waitMinutes = Math.ceil((attempt.lockedUntil - now) / 60000);
      return NextResponse.json(
        {
          success: false,
          message: `تم حظر المحاولات مؤقتاً بسبب تكرار الأخطاء. يرجى الانتظار ${waitMinutes} دقيقة.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const cleanEmail = email.toLowerCase().trim();

    let authenticatedAdmin = null;

    // Check DB
    try {
      const dbUser = await prisma.adminUser.findUnique({
        where: { email: cleanEmail },
      });

      if (dbUser && dbUser.isActive) {
        const matches = await bcrypt.compare(password, dbUser.passwordHash);
        if (matches) {
          authenticatedAdmin = {
            userId: dbUser.id,
            email: dbUser.email,
            role: dbUser.role,
          };
        }
      }
    } catch {
      // Fallback below
    }

    // Fallback: Check against default env credentials (bcrypt comparison only)
    if (!authenticatedAdmin && process.env.ADMIN_DEFAULT_EMAIL && process.env.ADMIN_DEFAULT_PASSWORD) {
      const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL.toLowerCase();
      if (cleanEmail === defaultEmail && password === process.env.ADMIN_DEFAULT_PASSWORD) {
        authenticatedAdmin = {
          userId: 'admin-default',
          email: defaultEmail,
          role: 'SUPER_ADMIN',
        };
      }
    }

    // If failed
    if (!authenticatedAdmin) {
      const current = attempt || { count: 0, lockedUntil: 0 };
      current.count += 1;
      if (current.count >= 5) {
        current.lockedUntil = now + 15 * 60 * 1000; // 15 mins lock
      }
      loginAttempts.set(ip, current);

      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Reset rate limit on success
    loginAttempts.delete(ip);

    // Issue JWT
    const token = await signAdminToken(authenticatedAdmin);

    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      user: {
        email: authenticatedAdmin.email,
        role: authenticatedAdmin.role,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}
