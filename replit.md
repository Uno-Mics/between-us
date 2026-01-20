# Between Us - Couples App

## Overview

Between Us is an intimate, private web application designed for couples to share moments, moods, notes, letters, and journal entries. The app uses a unique "Couple Key" authentication system where partners share a secret key to access their private space together. The aesthetic emphasizes warmth, coziness, and intimacy through soft colors, serif typography, and glassmorphism effects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React Context for auth state
- **Styling**: Tailwind CSS with custom warm color palette, shadcn/ui components (New York style)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Build Tool**: Vite with path aliases (`@/` for client/src, `@shared/` for shared)

### Backend Architecture
- **Framework**: Express.js 5 on Node.js
- **API Pattern**: REST endpoints defined in `shared/routes.ts` with Zod schemas for validation
- **Database**: Firebase Realtime Database via Firebase Admin SDK
- **Authentication**: Bearer token authentication using couple keys stored in localStorage

### Key Design Decisions

1. **Couple Key Authentication**: Instead of traditional user accounts, couples share a single secret key. This simplifies the model - one key = one couple's private space. The key acts as both identifier and authentication token.

2. **Shared Schema Layer**: The `shared/` directory contains Zod schemas and route definitions used by both frontend and backend, ensuring type safety across the stack.

3. **Ephemeral Notes**: Daily notes are designed to expire after 24 hours, encouraging spontaneous, in-the-moment sharing.

4. **Sealed Letters**: Letters can be "sealed" and must be explicitly opened, creating anticipation and mimicking physical love letters.

5. **No PostgreSQL/Drizzle Active**: While Drizzle config exists, the actual storage uses Firebase Realtime Database. The Drizzle setup appears to be scaffolding that could be used if migrating to PostgreSQL.

### Project Structure
```
client/           # React frontend
  src/
    components/   # Reusable UI components
    hooks/        # Custom React hooks (auth, data fetching)
    pages/        # Route pages
    lib/          # Utilities and query client
server/           # Express backend
  routes.ts       # API route handlers
  storage.ts      # Firebase storage implementation
  db.ts           # Firebase Admin SDK initialization
shared/           # Shared types and schemas
  schema.ts       # Zod schemas for data models
  routes.ts       # API route definitions
```

## External Dependencies

### Database
- **Firebase Realtime Database**: Primary data store for couples, notes, moods, letters, and journal entries
- **Environment Variables Required**:
  - `FIREBASE_SERVICE_ACCOUNT`: JSON string of Firebase service account credentials
  - `FIREBASE_DATABASE_URL`: Firebase Realtime Database URL

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **framer-motion**: Animations and transitions
- **date-fns**: Date formatting throughout the app
- **wouter**: Client-side routing
- **shadcn/ui + Radix**: UI component library

### Development Tools
- **Vite**: Development server with HMR
- **esbuild**: Production bundling for server
- **TypeScript**: Type checking across the codebase

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling