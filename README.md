# API Documents pour my-muqabala.fr

## 🚨 CONTEXTE DU PROJET

Ce projet Next.js a été créé pour résoudre un problème d'incompatibilité de frameworks entre le format d'API Next.js et l'application frontend existante basée sur Vite.

### Problème identifié

- L'application principale (`soulful-connections-new`) utilise **Vite** comme bundler
- Vite génère uniquement des fichiers statiques (HTML/JS/CSS)
- Vite **ne supporte pas** les API routes serveur
- Les API routes avec la structure `/api/documents/[...path]/route.ts` sont spécifiques à **Next.js App Router**

### Solution mise en place

Création d'un projet Next.js dédié pour héberger l'API qui servira les documents HTML depuis Supabase Storage.

## 📋 ÉTAPES RÉALISÉES

1. **Création du projet Next.js**
   ```bash
   npx create-next-app@latest my-muqabala-nextjs --typescript --app --no-tailwind --use-npm
   ```

2. **Installation des dépendances**
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Création de la structure de dossiers**
   ```bash
   mkdir -p app/api/documents/[...path]
   ```

4. **Configuration du fichier .env.local** (variables Supabase)
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://prbidefjoqdrqwjeenxm.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYmlkZWZqb3FkcnF3amVlbnhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMzY3NDEsImV4cCI6MjA2MzYxMjc0MX0.FaiiU8DTqnBVkNjG2L3wkE0MCsKnit_CNdGMmP0oRME
   ```

5. **Implémentation de l'API**
   - Création du fichier `app/api/documents/[...path]/route.ts`
   - Configuration pour servir les fichiers HTML depuis Supabase Storage
   - Gestion des erreurs et des formats de réponse appropriés

## 🚀 DÉPLOIEMENT

1. **Initialisation du dépôt Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - API documents pour my-muqabala.fr"
   git branch -M main
   git remote add origin https://github.com/User785485/my-muqabala-nextjs.git
   git push -u origin main
   ```

2. **Déploiement sur Vercel**
   - Connectez-vous à [Vercel](https://vercel.com/)
   - Importez le projet depuis GitHub
   - Configurez les variables d'environnement dans l'interface Vercel:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Configuration du domaine**
   - Dans les paramètres du projet Vercel, section "Domains"
   - Associez le domaine `www.my-muqabala.fr` à ce projet

## 🔗 UTILISATION DE L'API

Une fois déployée, l'API sera accessible à l'URL suivante:

```
https://www.my-muqabala.fr/api/documents/[chemin]/[nom-du-fichier].html
```

Exemple:
```
https://www.my-muqabala.fr/api/documents/compte-rendu/marie_mar_compte-rendu_1748054304541_5838.html
```

L'API récupère les fichiers HTML depuis le bucket Supabase Storage `documents` et les sert avec les headers appropriés.

## 🔍 PROBLÈMES COURANTS

- **Erreur 404**: Vérifiez que le fichier existe bien dans le bucket Supabase
- **Erreur 500**: Vérifiez les variables d'environnement Supabase dans Vercel
- **CORS**: L'API configure automatiquement `Access-Control-Allow-Origin: *`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
