// Script pour uploader des fichiers de test dans le bucket Supabase

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://prbidefjoqdrqwjeenxm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYmlkZWZqb3FkcnF3amVlbnhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMzY3NDEsImV4cCI6MjA2MzYxMjc0MX0.FaiiU8DTqnBVkNjG2L3wkE0MCsKnit_CNdGMmP0oRME';

// Cru00e9er le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour uploader des fichiers de test
async function uploadTestFiles() {
  console.log('\n=== Uploading des fichiers de test ===');
  
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

// Exécuter la fonction d'upload
async function main() {
  try {
    // Uploader les fichiers de test
    const successCount = await uploadTestFiles();
    
    if (successCount > 0) {
      console.log(`\n\u2705 ${successCount} fichiers ont été créés avec succès!`);
      console.log('\n\ud83d\udd17 Vous pouvez maintenant tester l\'URL:');
      console.log('https://www.my-muqabala.fr/api/documents/vente/jean_dup_vente_1748054304117_7523.html');
    } else {
      console.log('\n\u274c Aucun fichier n\'a pu être uploadé. Vérifiez les permissions du bucket.');
    }
  } catch (error) {
    console.error('Erreur dans le processus principal:', error);
  }
}

main();
