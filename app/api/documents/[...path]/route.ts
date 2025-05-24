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
export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  // Récupérer le chemin complet depuis les paramètres
  const pathSegments = params.path || [];
  const fullPath = pathSegments.join('/');
  
  console.log(`📄 API Documents: Requête reçue pour: ${fullPath}`);
  
  try {
    // Récupérer le fichier depuis Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(fullPath);
    
    if (error) {
      console.error(`❌ API Documents: Erreur lors de la récupération du fichier:`, error);
      
      // Retourner une erreur 404 si le fichier n'est pas trouvé
      return new NextResponse(`Document not found: ${fullPath}`, { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
    
    if (!data) {
      console.error(`❌ API Documents: Fichier non trouvé: ${fullPath}`);
      
      // Retourner une erreur 404 si aucune donnée n'est reçue
      return new NextResponse(`Document not found: ${fullPath}`, { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
    
    // Convertir le Blob en texte HTML
    const htmlContent = await data.text();
    
    console.log(`✅ API Documents: Fichier ${fullPath} servi avec succès (${htmlContent.length} octets)`);
    
    // Retourner le contenu HTML avec les en-têtes appropriés
    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache d'une heure
        'Access-Control-Allow-Origin': '*' // Pour éviter les problèmes CORS
      }
    });
    
  } catch (error) {
    console.error(`❌ API Documents: Erreur lors du traitement de la requête:`, error);
    
    // Retourner une erreur 500 en cas d'erreur serveur
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
