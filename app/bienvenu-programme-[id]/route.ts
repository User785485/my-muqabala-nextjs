import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase - identique u00e0 celle de [...path]/route.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://prbidefjoqdrqwjeenxm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYmlkZWZqb3FkcnF3amVlbnhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMzY3NDEsImV4cCI6MjA2MzYxMjc0MX0.FaiiU8DTqnBVkNjG2L3wkE0MCsKnit_CNdGMmP0oRME';
const bucketName = 'documents';

// Cru00e9er le client Supabase - exactement comme dans [...path]/route.ts
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Route API pour les URLs conviviales des documents d'onboarding
 * Format: /bienvenu-programme-ID.html
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Await pour ru00e9cupu00e9rer les params (nouveau dans Next.js 15)
  const params = await context.params;
  // Ru00e9cupu00e9rer l'ID depuis les paramu00e8tres
  const id = params.id;
  
  // Nettoyer l'ID pour enlever l'extension .html si pru00e9sente
  const cleanId = id.replace(/\.html$/, '');
  const fullPath = `onboarding/${cleanId}.html`;
  
  console.log(`ud83dudd00 URL conviviale: /bienvenu-programme-${id} accu00e8s direct u00e0: ${fullPath}`);
  console.log(`ud83dudd0d URL complu00e8te: ${request.url}`);
  
  try {
    console.log(`ud83dudd17 Tentative d'accu00e8s direct au fichier Supabase: ${fullPath}`);
    
    // Accu00e9der directement au fichier dans Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(fullPath);
    
    if (error || !data) {
      console.error(`u274c Erreur d'accu00e8s au fichier ${fullPath}:`, error);
      return new NextResponse(`Document not found: ${fullPath}`, { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    const htmlContent = await data.text();
    console.log(`u2705 Fichier servi directement: ${fullPath} (${htmlContent.length} octets)`);
    
    // Nettoyer la barre de du00e9bogage exactement comme dans la route originale
    let finalHtmlContent = htmlContent;
    
    // Patterns pour supprimer activement la barre verte, quelle que soit sa source
    const debugBarPatterns = [
      /<div[^>]*style="[^"]*position:\s*fixed[^"]*background(?:-color)?:\s*#28a745[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
      /<div[^>]*style='[^']*position:\s*fixed[^']*background(?:-color)?:\s*#28a745[^']*'[^>]*>[\s\S]*?<\/div>/gi,
      /<div[^>]*(?:class|id)="[^"]*debug[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
      /<div[^>]*>[\s\S]*?\|\s*Type:\s*\w+[\s\S]*?<\/div>/gi,
      /<div[^>]*style="[^"]*background-color:\s*#28a745[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
      /<div[^>]*class="[^"]*(?:debug-bar|debug|debugbar)[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
      /<div[^>]*id="[^"]*(?:debug-bar|debug|debugbar)[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
      /<div[^>]*style="[^"]*z-index:\s*9999[^"]*position:\s*fixed[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    ];
    
    // TOUJOURS nettoyer le HTML avant de le servir
    debugBarPatterns.forEach(pattern => {
      finalHtmlContent = finalHtmlContent.replace(pattern, '');
    });
    
    // Ajouter le script anti-debug comme dans l'API originale
    const autoCleanScript = `
<script>
(function() {
  function removeDebugBar() {
    const selectors = [
      'div[style*="#28a745"]', 
      'div[style*="background-color: #28a745"]',
      'div[style*="position: fixed"][style*="z-index: 9999"]',
      '.debug-bar', '#debug-bar',
      '[class*="debug"]'
    ];
    selectors.forEach(s => {
      const elements = document.querySelectorAll(s);
      elements.forEach(el => el.parentNode?.removeChild(el));
    });
  }
  // Exu00e9cuter immu00e9diatement
  removeDebugBar();
  // Exu00e9cuter apru00e8s chargement du DOM
  document.addEventListener('DOMContentLoaded', removeDebugBar);
  // Exu00e9cuter pu00e9riodiquement pour garantir la suppression
  setInterval(removeDebugBar, 1000);
})();
</script>`;
    
    // Ajouter le script anti-debug comme dans l'API originale
    if (finalHtmlContent.includes('</body>')) {
      finalHtmlContent = finalHtmlContent.replace('</body>', `${autoCleanScript}
</body>`);
    } else {
      finalHtmlContent += autoCleanScript;
    }
    
    // Renvoyer le HTML nettoyu00e9
    return new NextResponse(finalHtmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      }
    });
  } catch (error) {
    console.error(`u274c Erreur lors du traitement de la requu00eate:`, error);
    return new NextResponse(`Server error: ${error instanceof Error ? error.message : 'Unknown error'}`, { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}

/**
 * Configuration des options pour cette API route
 */
export const dynamic = 'force-dynamic'; // Ne pas mettre en cache la route
