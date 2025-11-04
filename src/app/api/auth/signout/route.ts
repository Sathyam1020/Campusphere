// app/api/auth/signout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    );

    // Clear auth cookie
    response.cookies.delete('auth-token');

    return response;
  } catch (error) {
    console.error('Signout error:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred during logout',
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