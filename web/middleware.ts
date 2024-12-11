import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';

interface CustomJWTPayload extends JWTPayload {
  id: string;
  email: string;
  username: string;
  role: string;
  exp: number; 
  fullname: string;
}

export default async function middleware(req: NextRequest) {

  if (req.nextUrl.pathname.startsWith('/api/validateToken')) {
    return NextResponse.next();
  }

  // Extract token from the HTTP-only cookie
  const token = req.cookies.get('goat-pen-token')?.value;
  
  if (!token) {
    if (req.nextUrl.pathname.startsWith('/api/public')) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }


  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!)) as { payload: CustomJWTPayload };
    
    if (req.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Proceed to the requested route if role is valid
    // Attach the user's id and role to a custom headers
    //------new
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', payload.id);
    requestHeaders.set('x-user-role', payload.role);

    // Create a NextResponse with modified request headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/api/:path*', '/deploy/:path*' ], 
};
