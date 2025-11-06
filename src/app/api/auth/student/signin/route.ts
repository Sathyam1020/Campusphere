// app/api/auth/student/signin/route.ts
import prisma from '@/lib/database';
import { generateToken } from '@/lib/jwt';
import { checkRateLimit, resetRateLimit } from '@/lib/rateLimit';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const studentSigninSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown';
    
    const rateLimit = await checkRateLimit(`student-signin:${ip}`, 10, 15, 30);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: `Too many failed login attempts. Account locked for ${rateLimit.lockoutMinutes} minutes.`,
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validationResult = studentSigninSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Find student by email
    const student = await prisma.student.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        bio: true,
        githubUsername: true,
        linkedin: true,
        interests: true,
        hobbies: true,
        cgpa: true,
        createdAt: true,
        college: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });

    const invalidCredentialsError = 'Invalid email or password';

    if (!student) {
      return NextResponse.json(
        { error: invalidCredentialsError, code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: invalidCredentialsError, code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    // Reset rate limit on successful login
    await resetRateLimit(`student-signin:${ip}`);

    // Generate JWT token
    const token = generateToken({
      userId: student.id,
      email: student.email,
      type: 'student',
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        student: {
          id: student.id,
          email: student.email,
          name: student.name,
          bio: student.bio,
          githubUsername: student.githubUsername,
          linkedin: student.linkedin,
          interests: student.interests,
          hobbies: student.hobbies,
          cgpa: student.cgpa,
          college: student.college,
          createdAt: student.createdAt,
        },
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    console.log('🍪 Cookie set:', {
      token: token.substring(0, 20) + '...',
      secure: process.env.NODE_ENV === 'production',
      NODE_ENV: process.env.NODE_ENV,
      cookiesLength: response.cookies.getAll().length
    });

    return response;
  } catch (error) {
    console.error('Student signin error:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred during login. Please try again.',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
    { status: 405 }
  );
}