# Project Match - Monorepo

**A modern web application built with a high-performance stack.**

## Tech Stack

- **Monorepo**: [Turborepo](https://turbo.build/)
- **Runtime**: [Bun](https://bun.sh/)
- **Frontend**: [Next.js 15](https://nextjs.org/) + [Clerk Auth](https://clerk.com/)
- **Backend**: [NestJS](https://nestjs.com/)
- **Database**: [PostgreSQL (Neon)](https://neon.tech/) + [Prisma](https://www.prisma.io/)
- **Linting**: [Biome](https://biomejs.dev/)

---

## 🚀 Getting Started

### 1. Prerequisites

- [Bun](https://bun.sh/) installed (`powershell -c "irm bun.sh/install.ps1 | iex"`)
- [Neon](https://neon.tech/) account for PostgreSQL
- [Clerk](https://clerk.com/) account for Authentication
- [Cloudinary](https://cloudinary.com/) account for image uploads

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Neon)
DATABASE_URL="postgresql://user:pass@ep-xyz.region.aws.neon.tech/neondb?sslmode=require"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Image Storage (Cloudinary - Optional/Required for uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Frontend/Backend Communication
FRONTEND_URL="http://localhost:3000"
PORT=3001
```

### 3. Install & Setup

```powershell
# Install dependencies
bun install

# Generate Prisma Client
bun run db:generate

# Push Schema to Database
bun run db:push
```

### 4. Run the Project

```powershell
# Start both Frontend (3000) and Backend (3001)
bun run dev
```

---

## 🏗️ Project Structure

```
.
├── apps/
│   ├── frontend/     # Next.js Application
│   │   ├── app/      # App Router (Pages & Layouts)
│   │   └── actions/  # Server Actions (call DB/API)
│   └── backend/      # NestJS API
│       ├── src/
│       │   ├── auth/ # Clerk Auth Guard & Service
│       │   ├── users/
│       │   ├── projects/
│       │   └── swipes/
├── packages/
│   └── database/     # Shared Prisma Schema & Client
├── turbo.json        # Pipeline config
└── package.json      # Workspace config
```

## 🛠️ Commands

- `bun run dev` - Start dev servers
- `bun run build` - Build all apps
- `bun run lint` - Check linting (Biome)
- `bun run format` - Format code (Biome)
- `bun run db:studio` - Open Prisma Studio to view data

## 🔐 Authentication Flow

1. **Frontend**: Uses `<ClerkProvider>` and `middleware.ts` to protect routes.
2. **Backend**: Protected endpoints use `ClerkAuthGuard` which verifies the Bearer token sent from the frontend.
3. **User Sync**: When a user logs in, `app/page.tsx` ensures their record exists in the PostgreSQL `User` table.
