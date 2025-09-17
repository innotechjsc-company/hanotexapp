"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";

// Separate component for HeroUIProvider that can use hooks
function HeroUIWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  return (
    <HeroUIProvider navigate={router.push}>
      {children}
    </HeroUIProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            cacheTime: 5 * 60 * 1000, // 5 minutes
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors
              if (
                error?.response?.status >= 400 &&
                error?.response?.status < 500
              ) {
                return false;
              }
              return failureCount < 3;
            },
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <HeroUIWrapper>
          {children}
        </HeroUIWrapper>
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </SessionProvider>
  );
}
