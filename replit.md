# Portal Judicial - Fiscalía RP

## Overview

Portal Judicial is a web-based judicial management system designed for a GTA V/FiveM roleplay server, simulating the Chilean judicial system. The application provides comprehensive case management, citizen and vehicle tracking, and document generation capabilities for law enforcement and judicial personnel. Built with institutional design principles to resemble official government portals, it offers a professional interface for managing legal proceedings, citations, confiscations, and criminal records within the roleplay environment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server with HMR support
- Wouter for lightweight client-side routing
- React Query (TanStack Query) for server state management and caching

**UI Component Strategy**
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom theme configuration
- Design system follows government/institutional web standards inspired by Chilean government portals
- Component composition pattern using compound components (Card, Form, Dialog, etc.)
- Accessibility-first approach with ARIA attributes and keyboard navigation

**Form Management**
- React Hook Form for performant form state management
- Zod for schema validation with @hookform/resolvers integration
- Shared validation schemas between frontend and backend via `@shared/schema`

**State Management Philosophy**
- Server state managed by React Query with optimistic updates
- Local UI state handled by React hooks (useState, useReducer)
- Authentication state managed through AuthContext provider
- Session-based authentication with protected routes

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- TypeScript for type safety across the stack
- Session-based authentication using express-session
- Custom middleware for authentication guards and request logging

**API Design**
- RESTful API architecture with resource-based endpoints
- JSON request/response format
- Session cookies for authentication state
- Error handling with structured error responses

**Database Layer**
- Drizzle ORM for type-safe database operations
- PostgreSQL as the primary database (via @neondatabase/serverless)
- Schema-first approach with Drizzle migrations
- Soft delete pattern for data retention (causes can be moved to "trash" before permanent deletion)

**Data Models**
- Users: Discord-based authentication with role-based access
- Citizens: RUT-indexed records with criminal history
- Vehicles: License plate-based registry with owner linking
- Causes: Legal cases with RUC/RIT identifiers and status tracking
- Confiscations: Evidence/property seizures linked to causes
- Citations: Judicial summons linked to causes

**Storage Abstraction**
- Interface-based storage pattern (IStorage) for data operations
- Supports multiple backend implementations (in-memory for development, database for production)
- Centralized data access logic through storage module

### Authentication System

**Discord OAuth Integration**
- Discord-only authentication strategy (no traditional username/password)
- Leverages Replit's connector system for OAuth flow management
- Automatic token refresh handling
- User profile data sourced from Discord (avatar, username, discriminator)

**Session Management**
- Express-session with configurable store (memory store for development)
- HTTP-only cookies for security
- 24-hour session lifetime
- Secure cookies in production environment

**Authorization Model**
- Role-based access control (currently stores role but not enforced)
- Admin role prepared for privileged operations (commented for testing)
- Session-based route protection via requireAuth middleware

### External Dependencies

**Authentication & User Management**
- Discord API for OAuth authentication and user profile data
- Replit Connector system for OAuth credential management

**Database**
- Neon Serverless Postgres for production database hosting
- Connection pooling via @neondatabase/serverless driver
- Environment-based configuration via DATABASE_URL

**UI Component Libraries**
- Radix UI primitives for accessible, unstyled components
- Lucide React for consistent iconography
- Tailwind CSS for utility-first styling

**Developer Tools**
- Vite plugins for development experience (@replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer)
- ESBuild for server-side bundling in production
- Drizzle Kit for database migrations and schema management

**Form & Validation**
- Zod for runtime type validation and schema definition
- React Hook Form for form state management
- Date-fns for date manipulation and formatting

**Development Dependencies**
- TypeScript for static type checking
- Shared type definitions between client and server via `@shared` alias
- Path aliases configured for clean imports (@/, @shared/, @assets/)