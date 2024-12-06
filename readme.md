# Fullstack CRUD Posts

Simple CRUD Posts template inspired by [jstack](https://github.com/upstash/jstack) (please give Stars to His Github)

## Tech Stack

- [Next.js 15](https://nextjs.org/)
- [Hono](https://hono.dev/) - Backend framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [React Query](https://tanstack.com/query/latest) - Data fetching
- [Clerk](https://clerk.com/) - Authentication
- [Neon](https://neon.tech/) - PostgreSQL Database
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Features

- 🔐 Authentication with Clerk
- 🚀 Full-stack TypeScript
- 🎯 Type-safe API
- 📚 CRUD operations
- 🎨 Modern UI with shadcn/ui
- 🌙 Dark mode
- 🔄 Optimistic updates
- 🛡️ Protected API routes
- 🧪 Validation with Zod
- 🔒 XSS Protection

## Getting Started

1. Clone the repository

```bash
git clone <repository-url>
```

2. Install dependecies

```bash
bun install
```

3. Set up environment variables

```bash
# Create .env file
cp .env.example .env
```

4. Set up your database

```bash
bunx prisma geenrate
bunx prisma db push
```

5. Run the development server

```bash
bun dev
```

## Deployment

This Web App Template is ready to be deployed on Vercel or Any App Hosting (Node JS or Edge Serverless Integrated)

## Credits

This project is inspired by jstack. Please consider giving it a star ⭐

## License

MIT
