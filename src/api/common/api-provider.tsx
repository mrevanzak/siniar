import { useReactQueryDevTools } from '@dev-plugins/react-query';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { ZodError } from 'zod';

import { showError, showErrorMessage } from '@/components/ui';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        showError(error);
      }

      if (error instanceof ZodError) {
        showErrorMessage('Something went wrong on server response');
        console.error(error);
      }
    },
  }),
});

export function APIProvider({ children }: { children: React.ReactNode }) {
  useReactQueryDevTools(queryClient);
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
