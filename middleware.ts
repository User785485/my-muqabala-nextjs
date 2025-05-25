import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware qui s'exécute avant chaque requête
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Détecter les formats d'URL personnalisés
  let type = '';
  let originalPath = '';
  
  if (pathname.startsWith('/mon-compte-rendu-personnalise-')) {
    type = 'compte-rendu';
    originalPath = pathname.replace('/mon-compte-rendu-personnalise-', '');
    console.log(`[Middleware] Détection URL personnalisée compte-rendu: ${pathname}`);
  } 
  else if (pathname.startsWith('/mon-accompagnement-')) {
    type = 'vente';
    originalPath = pathname.replace('/mon-accompagnement-', '');
    console.log(`[Middleware] Détection URL personnalisée vente: ${pathname}`);
  } 
  else if (pathname.startsWith('/bienvenu-programme-')) {
    type = 'onboarding';
    originalPath = pathname.replace('/bienvenu-programme-', '');
    console.log(`[Middleware] Détection URL personnalisée onboarding: ${pathname}`);
  }
  
  // Si une URL personnalisée est détectée, ajouter des en-têtes de diagnostic
  if (type) {
    const response = NextResponse.next();
    response.headers.set('x-detected-type', type);
    response.headers.set('x-original-path', originalPath);
    response.headers.set('x-rewrite-debug', 'true');
    console.log(`[Middleware] Ajout en-têtes: type=${type}, path=${originalPath}`);
    return response;
  }
  
  return NextResponse.next();
}

// Limiter l'exécution du middleware aux chemins pertinents
export const config = {
  matcher: [
    '/mon-compte-rendu-personnalise-:id*',
    '/mon-accompagnement-:id*',
    '/bienvenu-programme-:id*'
  ],
};
