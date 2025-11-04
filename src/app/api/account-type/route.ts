import prisma from '@/lib/database';
import { verifyToken } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Get token from cookie
    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Verify and decode token
    const payload = verifyToken(token);

    // Determine account type based on token type and verify in database
    let accountType: string | null = null;
    let userExists = false;

    if (payload.type === 'student') {
      const student = await prisma.student.findUnique({
        where: { id: payload.userId },
        select: { id: true }
      });
      userExists = !!student;
      accountType = 'STUDENT';
    } else if (payload.type === 'college') {
      // Check if user is a teacher or college admin
      const teacher = await prisma.teacher.findUnique({
        where: { id: payload.userId },
        select: { id: true }
      });
      
      if (teacher) {
        userExists = true;
        accountType = 'TEACHER';
      } else {
        const collegeAdmin = await prisma.collegeAdmin.findUnique({
          where: { id: payload.userId },
          select: { id: true }
        });
        
        if (collegeAdmin) {
          userExists = true;
          accountType = 'COLLEGE';
        } else {
          const recruiter = await prisma.recruiter.findUnique({
            where: { id: payload.userId },
            select: { id: true }
          });
          
          if (recruiter) {
            userExists = true;
            accountType = 'RECRUITER';
          }
        }
      }
    }

    if (!userExists || !accountType) {
      return NextResponse.json(
        { error: 'User not found or invalid account type', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    if (!userExists || !accountType) {
      return NextResponse.json(
        { error: 'User not found or invalid account type', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      accountType,
      userId: payload.userId,
      email: payload.email
    });

  } catch (error) {
    console.error('Account type fetch error:', error);
    
    if (error instanceof Error && error.message === 'Invalid or expired token') {
      return NextResponse.json(
        { error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
    { status: 405 }
  );
}