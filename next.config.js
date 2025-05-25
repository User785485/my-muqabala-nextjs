/** @type {import('next').NextConfig} */
const nextConfig = {
  // Activer la journalisation des rewrites en développement
  async rewrites() {
    console.log('\x1b[33m%s\x1b[0m', '[Next.js Config] Chargement des règles de rewrite');
    return [
      {
        // Compte-rendu : /mon-compte-rendu-personnalise-ID.html
        source: '/mon-compte-rendu-personnalise-:id*',
        destination: '/api/documents/compte-rendu/:id*',
      },
      {
        // Page de vente : /mon-accompagnement-ID.html
        source: '/mon-accompagnement-:id*',
        destination: '/api/documents/vente/:id*',
      },
      {
        // Onboarding : /bienvenu-programme-ID.html
        source: '/bienvenu-programme-:id*',
        destination: '/api/documents/onboarding/:id*'
      }
    ]
  },
  // Configuration supplémentaire pour optimiser la gestion des fichiers HTML
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          }
        ]
      }
    ]
  }
}

// Ajout d'un middleware personnalisé pour tracer toutes les requêtes
const originalRewrites = nextConfig.rewrites;
nextConfig.rewrites = async () => {
  const rules = await originalRewrites();
  console.log('\x1b[32m%s\x1b[0m', `[Rewrites] Règles chargées: ${rules.length} règles disponibles`);
  return rules;
};

module.exports = nextConfig
