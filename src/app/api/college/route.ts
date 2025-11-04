// app/api/colleges/route.ts
import prisma from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Build where clause for search (match fields present on the College model)
    const whereClause = {
      // no `isActive` field on the College model in schema, remove it
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { location: { contains: search, mode: 'insensitive' as const } },
          { domain: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    // Get colleges with pagination
    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          location: true,
          domain: true,
          logo: true,
          createdAt: true,
        },
        orderBy: [{ name: 'asc' }],
        take: limit,
        skip: offset,
      }),
      prisma.college.count({ where: whereClause }),
    ]);

    return NextResponse.json(
      {
        success: true,
        colleges,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: offset + colleges.length < total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get colleges error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch colleges',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

// Cache control headers for better performance
export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes