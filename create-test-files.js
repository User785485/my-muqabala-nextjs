// Script pour cru00e9er des fichiers de test dans Supabase Storage

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase - utilisez les mu00eames valeurs que dans votre .env.local
const supabaseUrl = 'https://prbidefjoqdrqwjeenxm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYmlkZWZqb3FkcnF3amVlbnhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMzY3NDEsImV4cCI6MjA2MzYxMjc0MX0.FaiiU8DTqnBVkNjG2L3wkE0MCsKnit_CNdGMmP0oRME';

// Cru00e9er le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Liste tous les fichiers dans le bucket "documents"
async function listAllFiles() {
  console.log('\n=== Vu00e9rification du bucket documents ===');
  
  // Vu00e9rifier les racines du bucket
  const { data: rootData, error: rootError } = await supabase
    .storage
    .from('documents')
    .list();
  
  if (rootError) {
    console.error('Erreur lors de la liste des fichiers racine:', rootError);
    return;
  }
  
  console.log('\nDossiers/fichiers u00e0 la racine:', rootData ? rootData.map(item => item.name) : []);
  
  // Vu00e9rifier spu00e9cifiquement le dossier "vente"
  if (rootData && rootData.some(item => item.name === 'vente')) {
    console.log('\n=== Le dossier "vente" existe ===');
    
    const { data: venteFiles, error: venteError } = await supabase
      .storage
      .from('documents')
      .list('vente');
    
    if (venteError) {
      console.error('Erreur lors de la liste des fichiers dans vente:', venteError);
      return;
    }
    
    console.log('\nFichiers dans le dossier "vente":', venteFiles.map(file => file.name));
  } else {
    console.log('\n\u274c Le dossier "vente" N\'EXISTE PAS ou est vide!');
  }
  
  // Vu00e9rifier u00e9galement le dossier "compte-rendu"
  if (rootData && rootData.some(item => item.name === 'compte-rendu')) {
    console.log('\n=== Le dossier "compte-rendu" existe ===');
    
    const { data: crFiles, error: crError } = await supabase
      .storage
      .from('documents')
      .list('compte-rendu');
    
    if (crError) {
      console.error('Erreur lors de la liste des fichiers dans compte-rendu:', crError);
      return;
    }
    
    console.log('\nFichiers dans le dossier "compte-rendu":', crFiles.map(file => file.name));
  } else {
    console.log('\n\u274c Le dossier "compte-rendu" N\'EXISTE PAS ou est vide!');
  }
}

// Fonction pour uploader des fichiers de test
async function uploadTestFiles() {
  console.log('\n=== Cru00e9ation de fichiers de test ===');
  
  // Cru00e9er le contenu HTML de test
  const createHtmlContent = (title, details) => `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #2c3e50; }
        .container { max-width: 800px; margin: 0 auto; }
        .info { background: #f8f9fa; padding: 20px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${title}</h1>
        <div class="info">
          <p>Ce fichier a u00e9tu00e9 cru00e9u00e9 le ${new Date().toLocaleString()} pour tester l'API.</p>
          <p>${details}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Liste des fichiers u00e0 cru00e9er
  const filesToCreate = [
    {
      path: 'vente/test.html',
      title: 'Fichier de test - Vente',
      details: 'Ceci est un fichier de test pour le dossier vente.'
    },
    {
      path: 'vente/jean_dup_vente_1748054304117_7523.html',
      title: 'Page de vente - Jean Dupont',
      details: 'Formation Excel Avancu00e9e - 497\u20ac - Premier mois offert'
    },
    {
      path: 'vente/marie_mar_vente_1748054304540_3982_retry1_retry2.html',
      title: 'Page de vente - Marie Martin',
      details: 'Coaching SEO - 1997\u20ac - Audit gratuit'
    },
    {
      path: 'compte-rendu/jean_dup_compte-rendu_1748054304119_7662.html',
      title: 'Compte-rendu - Jean Dupont',
      details: 'Objectifs: Devenir expert Excel en 3 mois<br>Recommandations: Pratiquer 30min par jour'
    },
    {
      path: 'compte-rendu/marie_mar_compte-rendu_1748054304541_5838.html',
      title: 'Compte-rendu - Marie Martin',
      details: 'Objectifs: Amu00e9liorer mon ru00e9fu00e9rencement Google<br>Recommandations: Optimiser meta-tags et structure'
    },
    {
      path: 'onboarding/jean_dup_onboarding_1748054304121_1063.html',
      title: 'Onboarding - Jean Dupont',
      details: 'u00c9tapes: Installation des outils, Module du00e9butant, Module avancu00e9, Projet final'
    },
    {
      path: 'onboarding/marie_mar_onboarding_1748054304547_7663.html',
      title: 'Onboarding - Marie Martin',
      details: 'u00c9tapes: Audit initial, Correction des erreurs, Suivi mensuel'
    }
  ];
  
  // Uploader chaque fichier
  console.log(`\nUploading ${filesToCreate.length} fichiers...`);
  
  for (const file of filesToCreate) {
    try {
      const htmlContent = createHtmlContent(file.title, file.details);
      
      // Uploader le fichier
      const { data, error } = await supabase
        .storage
        .from('documents')
        .upload(file.path, htmlContent, {
          contentType: 'text/html',
          upsert: true // Remplacer si existe du00e9ju00e0
        });
      
      if (error) {
        console.error(`\u274c Erreur upload de ${file.path}:`, error);
      } else {
        console.log(`\u2705 Fichier ${file.path} uploadu00e9 avec succu00e8s`);
      }
    } catch (error) {
      console.error(`\u274c Erreur globale pour ${file.path}:`, error);
    }
  }
}

// Exu00e9cuter les fonctions
async function main() {
  try {
    // Vu00e9rifier d'abord l'u00e9tat initial du bucket
    console.log('\u2139\ufe0f Vu00e9rification de l\'u00e9tat initial du bucket...');
    await listAllFiles();
    
    // Uploader les fichiers de test
    console.log('\n\u2139\ufe0f Cru00e9ation des fichiers de test...');
    await uploadTestFiles();
    
    // Vu00e9rifier l'u00e9tat final
    console.log('\n\u2139\ufe0f Vu00e9rification apru00e8s upload...');
    await listAllFiles();
    
    console.log('\n\u2705 Tous les fichiers ont u00e9tu00e9 cru00e9u00e9s avec succu00e8s!');
    console.log('\n\ud83d\udd17 Vous pouvez maintenant tester l\'URL:');
    console.log('https://www.my-muqabala.fr/api/documents/vente/jean_dup_vente_1748054304117_7523.html');
  } catch (error) {
    console.error('Erreur dans le processus principal:', error);
  }
}

main();
