'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, ThemeScript } from '@/lib/theme';
import { ToastProvider } from '@/components/ui/Toast';
import { MainLayout } from '@/components/layout/MainLayout';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <MainLayout>{children}</MainLayout>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Export ThemeScript for use in layout
export { ThemeScript };
