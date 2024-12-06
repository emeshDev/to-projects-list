import PostsPage from "@/components/PostsPage";
import { UserNav } from "@/components/UserNav";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <UserNav /> {/* Pindahkan ke luar container untuk fixed positioning */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="py-12 text-center">
          <h1 className="font-geist-sans text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Fullstack Template
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Next.js 15 + Hono + React Query + Prisma
          </p>
        </div>

        {/* Main Content */}
        <div className="py-8">
          <PostsPage />
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Built with Next.js and Hono • Template by Your Name</p>
        </footer>
      </div>
    </main>
  );
}
