import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Robust environment variable access with trimming
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Middleware: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // IMPORTANT: Do not use `supabase.auth.getSession()` in middleware
    // as it does not guarantee the session is revalidated.
    // Wrap in try-catch to handle potential "fetch failed" in Edge runtime
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl
    const isPublicRoute =
      pathname === '/login' ||
      pathname === '/signup' ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/icon') ||
      pathname.startsWith('/apple-icon') ||
      pathname === '/favicon.ico' ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.css') ||
      pathname.endsWith('.js')

    if (!user && !isPublicRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    if (user && (pathname === '/login' || pathname === '/signup')) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // RBAC: Restricted routes
    if (user && (pathname.startsWith('/audit') || pathname.startsWith('/users'))) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      const role = profile?.role
      const isAuthorized = role === 'Punong Barangay' || role === 'Secretary'
      
      if (!isAuthorized) {
        const url = request.nextUrl.clone()
        url.pathname = '/' // Redirect to dashboard if unauthorized
        return NextResponse.redirect(url)
      }
    }
  } catch (error) {
    // If fetch fails (e.g. network issue), we log it and continue instead of crashing
    console.error('Middleware: Fetch or Auth error observed:', error)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
