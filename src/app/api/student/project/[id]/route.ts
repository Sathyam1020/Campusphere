import prisma from '@/lib/database';
import { TokenPayload, verifyToken } from '@/lib/jwt';
import { checkRateLimit } from '@/lib/rateLimit';
import { NextRequest, NextResponse } from 'next/server';

// Authentication middleware
async function authenticate(req: NextRequest): Promise<{ user: TokenPayload; error?: never } | { user?: never; error: NextResponse }> {
  try {
    const token = req.cookies.get('auth-token')?.value || 
                  req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return {
        error: NextResponse.json(
          { 
            error: 'Authentication token is required',
            code: 'MISSING_TOKEN'
          },
          { status: 401 }
        )
      };
    }

    const user = verifyToken(token);

    if (user.type !== 'student') {
      return {
        error: NextResponse.json(
          { 
            error: 'Access denied. Only students can access projects.',
            code: 'INSUFFICIENT_PERMISSIONS'
          },
          { status: 403 }
        )
      };
    }

    return { user };
  } catch (error) {
    return {
      error: NextResponse.json(
        { 
          error: 'Invalid or expired authentication token',
          code: 'INVALID_TOKEN'
        },
        { status: 401 }
      )
    };
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;

    // Rate limiting for GET requests
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown';
    
    const rateLimit = await checkRateLimit(`get-project:${ip}`, 100, 15, 30);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: `Too many requests. Please try again in ${rateLimit.lockoutMinutes} minutes.`,
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      );
    }

    // Authentication
    const authResult = await authenticate(req);
    if (authResult.error) {
      return authResult.error;
    }
    const { user } = authResult;

    // Validate student exists
    const student = await prisma.student.findUnique({
      where: { id: user.userId },
      select: { 
        id: true, 
        name: true, 
        email: true,
        collegeId: true
      }
    });

    if (!student) {
      return NextResponse.json(
        { 
          error: 'Student account not found',
          code: 'STUDENT_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Fetch the project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { addedById: student.id }, // User is the creator
          { 
            teamMembers: {
              some: {
                studentId: student.id
              }
            }
          } // User is a team member
        ]
      },
      select: {
        id: true,
        title: true,
        description: true,
        githubUrl: true,
        skills: true,
        createdAt: true,
        addedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            college: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        teamMembers: {
          select: {
            id: true,
            role: true,
            addedAt: true,
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                college: {
                  select: {
                    id: true,
                    name: true,
                  }
                }
              }
            }
          },
          orderBy: {
            addedAt: 'asc'
          }
        },
        _count: {
          select: {
            teamMembers: true
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { 
          error: 'Project not found or you do not have access to it',
          code: 'PROJECT_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Add user role information
    const userMembership = project.teamMembers.find(member => member.student.id === student.id);
    const isCreator = project.addedBy.id === student.id;
    
    const projectWithUserRole = {
      ...project,
      userRole: isCreator ? 'Creator' : userMembership?.role || null,
      isUserCreator: isCreator,
      teamMemberCount: project._count.teamMembers
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          project: projectWithUserRole
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get project error:', error);
    
    return NextResponse.json(
      { 
        error: 'An error occurred while fetching the project. Please try again.',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Implementation for updating a project would go here
  return NextResponse.json(
    { error: 'Update functionality not implemented yet', code: 'NOT_IMPLEMENTED' },
    { status: 501 }
  );
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Implementation for deleting a project would go here
  return NextResponse.json(
    { error: 'Delete functionality not implemented yet', code: 'NOT_IMPLEMENTED' },
    { status: 501 }
  );
}