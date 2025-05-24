// Script pour cru00e9er le bucket Supabase et des fichiers de test

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase - utilisez les mu00eames valeurs que dans votre .env.local
const supabaseUrl = 'https://prbidefjoqdrqwjeenxm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYmlkZWZqb3FkcnF3amVlbnhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMzY3NDEsImV4cCI6MjA2MzYxMjc0MX0.FaiiU8DTqnBVkNjG2L3wkE0MCsKnit_CNdGMmP0oRME';

// Cru00e9er le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour cru00e9er le bucket
async function createBucket() {
  console.log('\n=== Tentative de cru00e9ation du bucket "documents" ===');
  
  try {
    // Vu00e9rifier si le bucket existe du00e9ju00e0
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Erreur lors de la liste des buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'documents');
    
    if (bucketExists) {
      console.log('\u2705 Le bucket "documents" existe du00e9ju00e0');
      return true;
    }
    
    // Cru00e9er le bucket s'il n'existe pas
    const { data, error } = await supabase.storage.createBucket('documents', {
      public: true, // Important: rendre le bucket public
    });
    
    if (error) {
      console.error('\u274c Erreur lors de la cru00e9ation du bucket:', error);
      return false;
    }
    
    console.log('\u2705 Bucket "documents" cru00e9u00e9 avec succu00e8s!');
    return true;
  } catch (error) {
    console.error('\u274c Erreur globale:', error);
    return false;
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
  
  let successCount = 0;
  
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
        successCount++;
      }
    } catch (error) {
      console.error(`\u274c Erreur globale pour ${file.path}:`, error);
    }
  }
  
  return successCount;
}

// Exu00e9cuter les fonctions
async function main() {
  try {
    // D'abord cru00e9er le bucket
    const bucketCreated = await createBucket();
    
    if (!bucketCreated) {
      console.error('\n\u274c Impossible de cru00e9er ou d\'acceder au bucket. Vu00e9rifiez vos permissions Supabase.');
      console.log('\nConseil: Utilisez une clu00e9 de service Supabase avec les permissions d\'administrateur');
      return;
    }
    
    // Uploader les fichiers de test
    console.log('\n\u2139\ufe0f Cru00e9ation des fichiers de test...');
    const successCount = await uploadTestFiles();
    
    if (successCount > 0) {
      console.log(`\n\u2705 ${successCount} fichiers ont u00e9tu00e9 cru00e9u00e9s avec succu00e8s!`);
      console.log('\n\ud83d\udd17 Vous pouvez maintenant tester l\'URL:');
      console.log('https://www.my-muqabala.fr/api/documents/vente/jean_dup_vente_1748054304117_7523.html');
    } else {
      console.log('\n\u274c Aucun fichier n\'a pu u00eatre uploadu00e9. Vu00e9rifiez vos permissions Supabase.');
    }
  } catch (error) {
    console.error('Erreur dans le processus principal:', error);
  }
}

main();
