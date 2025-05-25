/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // Compte-rendu : /mon-compte-rendu-personnalise-ID.html
        source: '/mon-compte-rendu-personnalise-:id*',
        destination: '/api/documents/compte-rendu/:id*'
      },
      {
        // Page de vente : /mon-accompagnement-ID.html
        source: '/mon-accompagnement-:id*',
        destination: '/api/documents/vente/:id*'
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

module.exports = nextConfig
