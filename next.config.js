/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration des logs pour le développement
  async rewrites() {
    console.log('\x1b[33m%s\x1b[0m', '[Next.js Config] Configuration des routes conviviales');
    // Aucune règle de rewrite n'est nécessaire car nous utilisons maintenant des routes directes
    // qui accèdent aux fichiers Supabase directement sans redirection
    return [
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
