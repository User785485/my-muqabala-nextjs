import { NextRequest, NextResponse } from 'next/server';

/**
 * Route API pour les URLs conviviales des comptes-rendus
 * Format: /mon-compte-rendu-personnalise-ID.html
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Ru00e9cupu00e9rer l'ID depuis les paramu00e8tres
  const id = params.id;
  
  // Nettoyer l'ID pour enlever l'extension .html si pru00e9sente
  const cleanId = id.replace(/\.html$/, '');
  
  console.log(`ud83dudd00 Redirection URL conviviale: /mon-compte-rendu-personnalise-${id} u2192 /api/documents/compte-rendu/${cleanId}.html`);
  
  // Rediriger vers l'API documents existante
  return NextResponse.redirect(
    `${request.nextUrl.origin}/api/documents/compte-rendu/${cleanId}.html`
  );
}

/**
 * Configuration des options pour cette API route
 */
export const dynamic = 'force-dynamic'; // Ne pas mettre en cache la route
