// Script pour vu00e9rifier les fichiers dans Supabase Storage

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
  
  console.log('\nDossiers/fichiers u00e0 la racine:', rootData.map(item => item.name));
  
  // Vu00e9rifier spu00e9cifiquement le dossier "vente"
  if (rootData.some(item => item.name === 'vente')) {
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
    
    // Vu00e9rifier si le fichier spu00e9cifique existe
    const specificFile = 'jean_dup_vente_1748054304117_7523.html';
    const fileExists = venteFiles.some(file => file.name === specificFile);
    
    console.log(`\nLe fichier "${specificFile}" existe: ${fileExists ? 'OUI \u2705' : 'NON \u274c'}`);
    
    // Vu00e9rifier d'autres fichiers mentionnu00e9s
    console.log('\n=== Vu00e9rification des autres fichiers mentionnu00e9s ===');
    const otherFiles = [
      'marie_mar_vente_1748054304540_3982_retry1_retry2.html'
    ];
    
    for (const file of otherFiles) {
      const exists = venteFiles.some(f => f.name === file);
      console.log(`Le fichier "${file}" existe: ${exists ? 'OUI \u2705' : 'NON \u274c'}`);
    }
  } else {
    console.log('\n\u274c Le dossier "vente" N\'EXISTE PAS!');
  }
  
  // Vu00e9rifier u00e9galement le dossier "compte-rendu"
  if (rootData.some(item => item.name === 'compte-rendu')) {
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
    
    // Vu00e9rifier des fichiers spu00e9cifiques
    const crSpecificFiles = [
      'jean_dup_compte-rendu_1748054304119_7662.html',
      'marie_mar_compte-rendu_1748054304541_5838.html'
    ];
    
    console.log('\n=== Vu00e9rification des fichiers compte-rendu ===');
    for (const file of crSpecificFiles) {
      const exists = crFiles.some(f => f.name === file);
      console.log(`Le fichier "${file}" existe: ${exists ? 'OUI \u2705' : 'NON \u274c'}`);
    }
  } else {
    console.log('\n\u274c Le dossier "compte-rendu" N\'EXISTE PAS!');
  }
}

// Fonction pour uploader un fichier de test si nu00e9cessaire
async function uploadTestFile() {
  console.log('\n=== Cru00e9ation d\'un fichier de test ===');
  
  // Cru00e9er le contenu HTML de test
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Fichier de test</title>
    </head>
    <body>
      <h1>Fichier de test Supabase Storage</h1>
      <p>Ce fichier a u00e9tu00e9 cru00e9u00e9 le ${new Date().toLocaleString()} pour tester l'API.</p>
    </body>
    </html>
  `;
  
  // S'assurer que le dossier vente existe
  try {
    // Uploader dans le dossier vente
    const { data: venteData, error: venteError } = await supabase
      .storage
      .from('documents')
      .upload('vente/test.html', htmlContent, {
        contentType: 'text/html',
        upsert: true // Remplacer si existe du00e9ju00e0
      });
    
    if (venteError) {
      console.error('Erreur upload dans vente:', venteError);
    } else {
      console.log('\u2705 Fichier test.html uploadu00e9 avec succu00e8s dans /vente');
    }
    
    // Uploader u00e9galement le fichier manquant
    const { data: specificData, error: specificError } = await supabase
      .storage
      .from('documents')
      .upload('vente/jean_dup_vente_1748054304117_7523.html', htmlContent, {
        contentType: 'text/html',
        upsert: true
      });
    
    if (specificError) {
      console.error('Erreur upload du fichier spu00e9cifique:', specificError);
    } else {
      console.log('\u2705 Fichier jean_dup_vente_1748054304117_7523.html uploadu00e9 avec succu00e8s');
    }
    
  } catch (error) {
    console.error('Erreur globale:', error);
  }
}

// Exu00e9cuter les fonctions
async function main() {
  // D'abord vu00e9rifier les fichiers existants
  await listAllFiles();
  
  // Demander u00e0 l'utilisateur s'il souhaite uploader un fichier de test
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('\nVoulez-vous uploader un fichier de test? (oui/non) ', async (answer) => {
    if (answer.toLowerCase() === 'oui' || answer.toLowerCase() === 'o') {
      await uploadTestFile();
      // Vu00e9rifier u00e0 nouveau apru00e8s l'upload
      await listAllFiles();
    }
    
    readline.close();
    console.log('\n=== Script terminu00e9 ===\n');
  });
}

main();
