import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: any[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
            });
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          } catch (e) {
            // If we can't set cookies on the request, we still want to set them on the response
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          }
        },
      },
    }
  );

  // refreshing the auth token
  const { data, error: authError } = await supabase.auth.getUser();
  
  // If we have an error that indicates the session is invalid (like Refresh Token Not Found),
  // we should ensure the user is redirected to login if they are on a protected route.
  const isInvalidSession = authError && (
    authError.message?.includes('Refresh Token') || 
    authError.message?.includes('invalid_grant') ||
    (authError as any).__isAuthError
  );

  if (isInvalidSession) {
    // If the session is invalid, we want to make sure we clear any stale cookies
    // and redirect to login if we're not already on a public page.
    const url = request.nextUrl.clone();
    
    // If we're on a protected route, redirect to login
    if (!request.nextUrl.pathname.startsWith('/login') && 
        !request.nextUrl.pathname.startsWith('/signup') && 
        !request.nextUrl.pathname.startsWith('/auth')) {
      url.pathname = '/login';
      const response = NextResponse.redirect(url);
      // Copy headers from supabaseResponse which should contain the cookie-clearing instructions
      supabaseResponse.headers.forEach((value, key) => {
        response.headers.set(key, value);
      });
      return response;
    }
  }

  const user = isInvalidSession ? null : data?.user;

  if (!user && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/signup') && !request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    const response = NextResponse.redirect(url);
    supabaseResponse.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });
    return response;
  }

  if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    const response = NextResponse.redirect(url);
    supabaseResponse.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });
    return response;
  }

  return supabaseResponse;
}
