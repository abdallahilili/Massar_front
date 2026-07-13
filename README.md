# مسار — Frontend (Messar)

Frontend React 19 / TypeScript / Vite pour le portail « مسار » (Ministère du
Commerce et du Tourisme de Mauritanie), généré à partir du backend Django
fourni (`Messar.zip`) et du document de parcours investisseur (`تجربة_المستثمر.pdf`).

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production (0 erreur TypeScript, 0 warning oxlint)
```

Configurer l'URL de l'API dans `.env` :

```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · React Router DOM 7 ·
TanStack Query · Axios · React Hook Form + Zod · Zustand · Framer Motion ·
Lucide React · Recharts · Sonner · date-fns.

## Ce qui a été implémenté — uniquement les endpoints réels du backend

| Écran | Endpoint(s) backend utilisé(s) |
|---|---|
| Accueil (« ماذا تريد أن تنشئ؟ ») | `GET /api/services/` |
| Détail d'un type d'activité | `GET /api/services/{id}/` |
| Vérifier un nom | `GET/POST /api/projects/check-name/` |
| Inscription (compte + investisseur + réservation + projet) | `POST /api/projects/onboarding/` puis `POST /api/auth/login/` |
| Connexion | `POST /api/auth/login/`, refresh automatique via `POST /api/auth/refresh/` |
| Tableau de bord investisseur | `GET /api/workflow/projects/{id}/status/`, `POST /api/workflow/documents/`, `POST /api/workflow/projects/{id}/submit/`, `POST /api/operations/payments/`, `GET /api/operations/projects/{id}/licenses/` |
| Vérification publique d'un ticket de licence | `GET /api/operations/verify/{license_number}/` |
| Espace inspecteur | `GET /api/operations/inspections/mine/`, `POST /api/operations/inspections/{id}/report/` |
| Espace administration | `POST /api/operations/payments/{id}/verify/` |

Aucun endpoint n'a été inventé. Le code source de `Messar/` (models,
serializers, views, urls, services) a été lu intégralement avant de générer
ce frontend.

## Limites réelles du backend actuel (importantes à connaître)

Le backend fourni est un MVP orienté "parcours" (les 11 chapitres du
document), pas un CRUD complet par modèle. Concrètement :

- **Aucun endpoint « mon profil / mes projets »** (`GET /api/accounts/...`
  n'existe pas). Après connexion, l'application ne peut donc pas retrouver
  automatiquement le projet d'un investisseur : le contexte projet
  (`projectId`, `serviceTypeId`) est mémorisé localement au moment de
  l'inscription (Zustand + localStorage), et un écran « ربط مشروعك بهذا
  الجهاز » permet de le ressaisir manuellement si l'utilisateur change
  d'appareil ou vide son cache.
- **`DocumentViewSet` n'expose que la création** (`CreateModelMixin` seul) —
  impossible de lister les documents déjà envoyés. L'interface affiche donc
  l'état d'upload par exigence côté client (pendant la session), la seule
  source de vérité durable étant `progress_percentage` renvoyé par
  `GET /workflow/projects/{id}/status/`.
- **`PaymentViewSet` et `LicenseViewSet` n'exposent pas de liste** (pas de
  `ListModelMixin`) : l'écran administration ne peut donc que *vérifier une
  quittance par identifiant*, sans lister les quittances en attente.
- **Le token JWT ne contient aucun rôle** (pas de claims personnalisées côté
  `SIMPLE_JWT`) : la page de connexion demande donc à l'utilisateur de
  préciser sous quel rôle il se connecte (investisseur / inspecteur /
  administration), uniquement pour l'aiguillage de l'interface — les
  permissions réelles restent vérifiées par le backend à chaque requête.

Pour un produit final, il serait utile d'ajouter côté backend : un endpoint
`GET /api/accounts/me/` (id, email, role), un endpoint de liste des projets
d'un investisseur, et les `ListModelMixin` manquants sur `DocumentViewSet`,
`PaymentViewSet` et `LicenseViewSet`.

## Structure

```
src/
  api/          # un module par app backend (auth, core, projects, workflow, operations)
  components/   # ui/ (primitives), layout/, common/, cards/
  constants/    # routes, libellés de statut
  pages/        # public/, investor/, inspector/, admin/, errors/
  routes/       # configuration React Router + garde-fous de rôle
  stores/       # session Zustand (jetons, rôle, contexte projet)
  types/        # types alignés strictement sur les serializers DRF
  utils/        # schémas Zod, cn(), gestion d'erreurs API
```
