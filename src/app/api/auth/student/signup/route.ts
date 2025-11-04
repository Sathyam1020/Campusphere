// app/api/auth/student/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
// Use bcryptjs. If you haven't installed it, run:
// npm install bcryptjs
// npm install -D @types/bcryptjs
import prisma from '@/lib/database';
import { generateToken } from '@/lib/jwt';
import { checkRateLimit } from '@/lib/rateLimit';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';

const studentSignupSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  collegeId: z.string().min(1, 'College selection is required'),
  bio: z.string().optional(),
  githubUsername: z.string().optional(),
  linkedin: z.string().optional(),
  interests: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown';
    
    const rateLimit = await checkRateLimit(`student-signup:${ip}`, 5, 15, 30);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: `Too many signup attempts. Please try again in ${rateLimit.lockoutMinutes} minutes.`,
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validationResult = studentSignupSchema.safeParse(body);

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

    const { email, password, name, collegeId, bio, githubUsername, linkedin, interests, hobbies } = validationResult.data;

    // Validate college
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: { id: true, name: true, location: true },
    });

    if (!college) {
      return NextResponse.json(
        { 
          error: 'Selected college not found',
          code: 'COLLEGE_NOT_FOUND'
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          error: 'A user with this email already exists',
          code: 'USER_EXISTS'
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Use transaction to create both User and Student
    const result = await prisma.$transaction(async (tx) => {
      // Create User record
      const user = await tx.user.create({
        data: {
          id: `student_${Date.now()}_${Math.random().toString(36).substring(2)}`,
          email,
          name,
          accountType: 'STUDENT',
          emailVerified: false,
        },
      });

      // Create Student record
      const student = await tx.student.create({
        data: {
          id: user.id, // Use same ID for consistency
          email,
          password: hashedPassword,
          name,
          collegeId,
          bio: bio || null,
          githubUsername: githubUsername || null,
          linkedin: linkedin || null,
          interests: interests || [],
          hobbies: hobbies || [],
        },
        select: {
          id: true,
          email: true,
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

      return { user, student };
    });

    // Generate JWT token
    const token = generateToken({
      userId: result.student.id,
      email: result.student.email,
      type: 'student',
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Student registered successfully',
        student: {
          id: result.student.id,
          email: result.student.email,
          name: result.student.name,
          bio: result.student.bio,
          githubUsername: result.student.githubUsername,
          linkedin: result.student.linkedin,
          interests: result.student.interests,
          hobbies: result.student.hobbies,
          cgpa: result.student.cgpa,
          college: result.student.college,
          createdAt: result.student.createdAt,
        },
      },
      { status: 201 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Student signup error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { 
            error: 'This email is already registered',
            code: 'DUPLICATE_EMAIL'
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'An error occurred during registration. Please try again.',
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