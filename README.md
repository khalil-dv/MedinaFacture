# IziFacture

Facturation simple pour entrepreneurs africains : créez des factures, suivez
les paiements, gérez vos clients et vos coordonnées de paiement — le tout en
français, avec devise et format de date adaptés à votre pays (194 pays
disponibles).

## Fonctionnalités

- Factures avec TVA calculée automatiquement (taux par défaut configurable)
- Statuts : brouillon, envoyée, payée, en retard (passage automatique à
  l'échéance)
- Encaissement partiel ou total avec calcul du reste dû
- Numérotation automatique par année (`INV-2026-0001`)
- Coordonnées de paiement (virement bancaire, Wave, Orange Money)
- Gestion des clients, notifications d'échéance, tableau de bord
- Export PDF de chaque facture
- Mode clair / sombre (persistant)
- Compte utilisateur par e-mail (Supabase Auth)

## Stack

- [Next.js 14](https://nextjs.org) (App Router) + React 18 + TypeScript strict
- [Tailwind CSS](https://tailwindcss.com) 3
- [Supabase](https://supabase.com) (Auth + Postgres avec Row Level Security)
- [jsPDF](https://github.com/parallax/jsPDF) pour l'export PDF
- [Zod](https://zod.dev) pour la validation des formulaires

## Prérequis

- Node.js 18.18+ (20+ recommandé)
- Un projet [Supabase](https://supabase.com)

## Installation

```bash
npm install
cp .env.example .env.local
```

Renseignez les valeurs dans `.env.local` (voir `lib/supabase/` pour l'usage) :

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase (Settings → API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé **PUBLISHABLE** (jamais la secret key `sb_secret_…`) |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site en production (e-mails, SEO) |

> ⚠️ La clé `NEXT_PUBLIC_*` est embarquée côté navigateur. N'utilisez jamais une
> « Secret key » (`sb_secret_…`) dans cette application : elle serait exposée
> publiquement.

### Base de données Supabase

Dans le dashboard Supabase (**SQL Editor → New query**), exécutez dans l'ordre :

1. `supabase/schema.sql` — tables, triggers, RLS et politiques
2. `supabase/migrations/001_payment_methods.sql` — méthode de paiement par facture
3. `supabase/migrations/002_rls_hardening.sql` — `with check` sur les politiques
4. `supabase/migrations/003_security_hardening.sql` — privilèges minimaux et
   contraintes de données

Puis rechargez le schéma :

```sql
select pg_notify('pgrst', 'reload schema');
```

#### Configuration de l'authentification

Dans **Supabase → Authentication → URL Configuration** :

- Site URL : votre URL de production (ex. `https://izifacture.vercel.app`)
- Redirect URLs : `https://votre-domaine/auth/callback` et
  `http://localhost:3000/auth/callback` (développement)

## Scripts

```bash
npm run dev       # serveur de développement
npm run build     # build de production (lint + types inclus)
npm run start     # serveur de production
npm run lint      # ESLint
npm run typecheck # vérification TypeScript
```

## Déploiement

### Vercel (recommandé)

1. Poussez le dépôt vers GitHub/GitLab/Bitbucket
2. Importez-le sur [Vercel](https://vercel.com) (framework détecté : Next.js)
3. Ajoutez les variables d'environnement du fichier `.env.example`
4. Déployez

### Docker / autre hébergeur

```bash
npm run build
npm run start
```

Le build passe par `next build` (génère `.next`). Définissez les mêmes
variables d'environnement sur votre serveur.

## Sécurité

- **RLS** : chaque table est protégée par des politiques d'accès limitées au
  propriétaire (`auth.uid()`)
- **Privilèges minimaux** : le rôle `anon` n'a aucun accès aux tables
  (`supabase/migrations/003_security_hardening.sql`)
- **En-têtes HTTP** : CSP, X-Frame-Options, HSTS, nosniff… définis dans
  `next.config.mjs`
- **Redirection** : le paramètre `next` est assaini dans
  `app/auth/callback/route.ts`
- Les montants sont stockés en entiers (pas de virgule flottante)

## Structure

```
app/                 pages App Router
  (auth)/            connexion, inscription, mot de passe oublié
  (dashboard)/       tableau de bord, factures, clients, paramètres…
  auth/callback/     échange de code de session (OAuth/e-mail)
  globals.css        styles + thème clair/sombre
components/          UI réutilisable (formulaires, modales, badges…)
lib/
  store.tsx          état global + accès Supabase (création/lecture)
  calculations.ts    totaux et numérotation des factures
  pdf.ts             génération PDF (jsPDF)
  format.ts          monnaie, dates, quantités
  countries.ts       devise/langue/format par pays
  supabase/          clients navigateur/serveur + middleware
supabase/            schéma SQL et migrations
```
