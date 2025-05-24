import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://prbidefjoqdrqwjeenxm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYmlkZWZqb3FkcnF3amVlbnhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMzY3NDEsImV4cCI6MjA2MzYxMjc0MX0.FaiiU8DTqnBVkNjG2L3wkE0MCsKnit_CNdGMmP0oRME';
const bucketName = 'documents';

// Créer le client Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * API route qui sert les documents HTML depuis Supabase Storage
 * URL: /api/documents/[...path]
 * Exemple: /api/documents/vente/client-xyz.html
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  // Await pour récupérer les params (nouveau dans Next.js 15)
  const params = await context.params;
  const pathSegments = params.path || [];
  const fullPath = pathSegments.join('/');
  
  // Logs détaillés pour le débogage
  console.log(`📄 API Documents: Requête reçue pour: ${fullPath}`);
  console.log(`🔍 API Documents: URL complète: ${request.url}`);
  console.log(`🔑 API Documents: Supabase URL: ${supabaseUrl.substring(0, 20)}...`);
  console.log(`🔑 API Documents: Supabase Anon Key définie: ${!!supabaseAnonKey}`);
  console.log(`💾 API Documents: Bucket: ${bucketName}`);
  
  try {
    console.log(`💾 API Documents: Tentative de téléchargement depuis Supabase: ${fullPath}`);
    
    // Ajout d'une vérification pour voir si le fichier existe
    const { data: fileList, error: listError } = await supabase.storage
      .from(bucketName)
      .list(fullPath.split('/').slice(0, -1).join('/') || undefined);
      
    if (listError) {
      console.error(`❌ API Documents: Erreur lors de la vérification du répertoire:`, listError);
    } else {
      const fileName = fullPath.split('/').pop();
      const fileExists = fileList.some(file => file.name === fileName);
      console.log(`💾 API Documents: Liste des fichiers dans le répertoire:`, 
        fileList.map(f => f.name).join(', '));
      console.log(`💾 API Documents: Fichier ${fileName} existe dans le bucket: ${fileExists}`);
    }
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(fullPath);
    
    if (error || !data) {
      console.error(`❌ API Documents: Erreur de téléchargement:`, error);
      
      // Log détaillé de l'erreur Supabase
      if (error) {
        console.error(`❌ API Documents: Message d'erreur: ${error.message}`);
        console.error(`❌ API Documents: Erreur complète:`, JSON.stringify(error));
      }
      
      return new NextResponse(`Document not found: ${fullPath}`, { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    const htmlContent = await data.text();
    console.log(`✅ Fichier servi: ${fullPath} (${htmlContent.length} octets)`);
    
    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error(`❌ Erreur serveur:`, error);
    return new NextResponse('Server error', { status: 500 });
  }
}

/**
 * Configuration des options pour cette API route
 */
export const dynamic = 'force-dynamic'; // Ne pas mettre en cache la route
