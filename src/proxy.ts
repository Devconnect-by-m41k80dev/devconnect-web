import { jwtDecode } from 'jwt-decode'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PREFIXES  = ['/profile', '/discover', '/projects/new', '/applications']
const ADMIN_ONLY_PREFIXES = ['/admin']

type Role = 'user' | 'admin'

interface JwtPayload {
  sub:   string
  email: string
  role:  Role
  iat?:  number
  exp?:  number
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get('token')?.value

  let userRole: Role | null = null
  if (token) {
    try {
      const payload = jwtDecode<JwtPayload>(token)
      userRole = payload.role
    } catch (err) {
      userRole = null
      console.error(err)
    }
  }

  const redirectTo = (path: string, redirect?: string) => {
    const url = new URL(path, request.url)
    if (redirect) url.searchParams.set('redirect', redirect)
    return NextResponse.redirect(url)
  }

  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) && !userRole) {
    const url = new URL('/', request.url)
    url.searchParams.set('auth', 'login')
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (ADMIN_ONLY_PREFIXES.some((p) => pathname.startsWith(p)) && userRole !== 'admin') {
    return redirectTo('/projects')
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
