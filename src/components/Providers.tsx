"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { HTTPException } from "hono/http-exception";
import { ThemeProvider } from "next-themes";
import { PropsWithChildren, useEffect, useState } from "react";

export const Providers = ({ children }: PropsWithChildren) => {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (err) => {
            let errorMessage: string;
            if (err instanceof HTTPException) {
              errorMessage = err.message;
            } else if (err instanceof Error) {
              errorMessage = err.message;
            } else {
              errorMessage = "An unknown error occurred.";
            }
            console.log(errorMessage);
          },
        }),
      })
  );

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
};
