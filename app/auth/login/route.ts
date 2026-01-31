import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Make a request to your NestJS backend for login
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json({ message: errorData.message || 'Login failed' }, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    // You might want to set a cookie here with the token or return it directly
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
