// app/api/student/project/create-project/route.ts
import prisma from '@/lib/database';
import { TokenPayload, verifyToken } from '@/lib/jwt';
import { checkRateLimit } from '@/lib/rateLimit';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for project creation
const createProjectSchema = z.object({
  title: z.string()
    .min(3, 'Project title must be at least 3 characters')
    .max(100, 'Project title must be less than 100 characters')
    .trim(),
  description: z.string()
    .min(10, 'Project description must be at least 10 characters')
    .max(2000, 'Project description must be less than 2000 characters')
    .trim(),
  githubUrl: z.string()
    .url('GitHub URL must be a valid URL')
    .regex(/^https:\/\/github\.com\//, 'Must be a valid GitHub repository URL')
    .optional()
    .or(z.literal('')),
  skills: z.array(z.string().trim().min(1))
    .min(1, 'At least one skill is required')
    .max(20, 'Cannot add more than 20 skills')
    .refine(skills => skills.every(skill => skill.length <= 50), 'Each skill must be 50 characters or less'),
  teamMembers: z.array(z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    role: z.string()
      .min(1, 'Role is required')
      .max(50, 'Role must be less than 50 characters')
      .optional()
  }))
    .max(10, 'Cannot add more than 10 team members')
    .optional()
    .default([]),
});

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
            error: 'Access denied. Only students can create projects.',
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

// Validate team members exist and are students
async function validateTeamMembers(studentIds: string[], currentStudentId: string) {
  if (studentIds.length === 0) return [];

  // Remove duplicates and current student
  const uniqueIds = [...new Set(studentIds)].filter(id => id !== currentStudentId);

  if (uniqueIds.length !== studentIds.length) {
    throw new Error('Duplicate team members or self-addition detected');
  }

  const students = await prisma.student.findMany({
    where: {
      id: { in: uniqueIds }
    },
    select: {
      id: true,
      name: true,
      email: true,
    }
  });

  if (students.length !== uniqueIds.length) {
    const foundIds = students.map(s => s.id);
    const notFound = uniqueIds.filter(id => !foundIds.includes(id));
    throw new Error(`Students not found: ${notFound.join(', ')}`);
  }

  return students;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown';
    
    const rateLimit = await checkRateLimit(`create-project:${ip}`, 10, 15, 30);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: `Too many project creation attempts. Please try again in ${rateLimit.lockoutMinutes} minutes.`,
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
        collegeId: true,
        college: {
          select: {
            id: true,
            name: true
          }
        }
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

    // Parse and validate request body
    const body = await req.json();
    const validationResult = createProjectSchema.safeParse(body);

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

    const { title, description, githubUrl, skills, teamMembers } = validationResult.data;

    // Check for duplicate project title by the same student
    const existingProject = await prisma.project.findFirst({
      where: {
        title: title.toLowerCase(),
        addedById: student.id
      },
      select: { id: true }
    });

    if (existingProject) {
      return NextResponse.json(
        { 
          error: 'You already have a project with this title',
          code: 'DUPLICATE_PROJECT_TITLE'
        },
        { status: 409 }
      );
    }

    // Validate team members if provided
    const validatedTeamMembers = teamMembers.length > 0 
      ? await validateTeamMembers(teamMembers.map(tm => tm.studentId), student.id)
      : [];

    // Create project with transaction
    const project = await prisma.$transaction(async (tx) => {
      // Create the project
      const newProject = await tx.project.create({
        data: {
          title,
          description,
          githubUrl: githubUrl || null,
          skills,
          addedById: student.id,
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
            }
          }
        }
      });

      // Add team members if any
      if (teamMembers.length > 0) {
        const memberData = teamMembers.map(tm => ({
          projectId: newProject.id,
          studentId: tm.studentId,
          role: tm.role || 'Member',
        }));

        await tx.projectMember.createMany({
          data: memberData
        });
      }

      // Add creator as project owner
      await tx.projectMember.create({
        data: {
          projectId: newProject.id,
          studentId: student.id,
          role: 'Owner',
        }
      });

      return newProject;
    });

    // Fetch complete project data with members
    const completeProject = await prisma.project.findUnique({
      where: { id: project.id },
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
              }
            }
          }
        }
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Project created successfully',
        project: completeProject,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Project creation error:', error);
    
    if (error instanceof Error) {
      // Handle specific database constraints
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { 
            error: 'A project with similar details already exists',
            code: 'DUPLICATE_PROJECT'
          },
          { status: 409 }
        );
      }

      // Handle team member validation errors
      if (error.message.includes('Students not found') || 
          error.message.includes('Duplicate team members')) {
        return NextResponse.json(
          { 
            error: error.message,
            code: 'INVALID_TEAM_MEMBERS'
          },
          { status: 400 }
        );
      }

      // Handle foreign key constraints
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { 
            error: 'Invalid reference to student or other entity',
            code: 'INVALID_REFERENCE'
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'An error occurred while creating the project. Please try again.',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

// GET method to retrieve projects created by the authenticated user
export async function GET(req: NextRequest) {
  try {
    // Rate limiting for GET requests
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown';
    
    const rateLimit = await checkRateLimit(`get-projects:${ip}`, 50, 15, 30);
    
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
      console.error('Student not found for userId:', user.userId);
      return NextResponse.json(
        { 
          error: 'Student account not found',
          code: 'STUDENT_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    console.log('Student found:', { id: student.id, email: student.email });

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const queryParams = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
      includeTeamProjects: searchParams.get('includeTeamProjects') || 'false',
    };

    // Validate query parameters
    const page = Math.max(1, parseInt(queryParams.page));
    const limit = Math.min(50, Math.max(1, parseInt(queryParams.limit))); // Max 50 items per page
    const search = queryParams.search;
    const sortBy = ['createdAt', 'title'].includes(queryParams.sortBy) ? queryParams.sortBy : 'createdAt';
    const sortOrder = ['asc', 'desc'].includes(queryParams.sortOrder) ? queryParams.sortOrder : 'desc';
    const includeTeamProjects = queryParams.includeTeamProjects === 'true';

    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const whereClause: any = {};

    if (includeTeamProjects) {
      // Include projects where user is creator OR team member
      whereClause.OR = [
        { addedById: student.id },
        { 
          teamMembers: {
            some: {
              studentId: student.id
            }
          }
        }
      ];
    } else {
      // Only projects created by the user
      whereClause.addedById = student.id;
    }

    // Add search filter if provided
    if (search && search.trim()) {
      const searchCondition = {
        OR: [
          { title: { contains: search.trim(), mode: 'insensitive' as const } },
          { description: { contains: search.trim(), mode: 'insensitive' as const } },
          { skills: { has: search.trim() } }
        ]
      };

      if (whereClause.OR) {
        // If we already have OR for team projects, wrap everything
        whereClause.AND = [
          { OR: whereClause.OR },
          searchCondition
        ];
        delete whereClause.OR;
      } else {
        Object.assign(whereClause, searchCondition);
      }
    }

    console.log('Query parameters:', { page, limit, search, sortBy, sortOrder, includeTeamProjects });
    console.log('Where clause:', JSON.stringify(whereClause, null, 2));

    // Get total count for pagination
    const totalCount = await prisma.project.count({
      where: whereClause
    });

    console.log('Total count:', totalCount);

    // Fetch projects with pagination and sorting
    const projects = await prisma.project.findMany({
      where: whereClause,
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
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    });

    console.log('Fetched projects count:', projects.length);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Add user role information to each project
    const projectsWithUserRole = projects.map(project => {
      const userMembership = project.teamMembers.find(member => member.student.id === student.id);
      const isCreator = project.addedBy.id === student.id;
      
      return {
        ...project,
        userRole: isCreator ? 'Creator' : userMembership?.role || null,
        isUserCreator: isCreator,
        teamMemberCount: project._count.teamMembers
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          projects: projectsWithUserRole,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            hasNextPage,
            hasPreviousPage,
            itemsPerPage: limit
          },
          filters: {
            search: search || null,
            sortBy,
            sortOrder,
            includeTeamProjects
          }
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get projects error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type'
    });
    
    return NextResponse.json(
      { 
        error: 'An error occurred while fetching projects. Please try again.',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
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

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
    { status: 405 }
  );
}
