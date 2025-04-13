import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Vérifier si l'utilisateur est authentifié pour les routes protégées
  const protectedRoutes = ['/dashboard', '/characters', '/books', '/stories'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Rediriger vers le tableau de bord si l'utilisateur est déjà connecté
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some(route => 
    req.nextUrl.pathname === route
  );

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/characters/:path*',
    '/books/:path*',
    '/stories/:path*',
    '/login',
    '/register',
  ],
};
