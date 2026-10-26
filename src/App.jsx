import React, { useMemo, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './app/store';
import { createAppRouter } from './routes/router';
import { refreshApi } from './services/auth.api';
import { setCredentials, setInitialized } from './features/auth/authSlice';

// Create TanStack Query client with predictable defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes before refetching
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRouterContainer() {
  const dispatch = useDispatch();

  // Restore session from HTTP-only cookie upon browser refresh
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await refreshApi();
        if (response?.data?.accessToken) {
          dispatch(
            setCredentials({
              user: response.data.user,
              accessToken: response.data.accessToken,
            })
          );
        } else {
          dispatch(setInitialized());
        }
      } catch {
        // No valid session cookie found; user must log in
        dispatch(setInitialized());
      }
    };

    restoreSession();
  }, [dispatch]);

  // Memoize data router instance
  const router = useMemo(() => createAppRouter(queryClient), []);

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRouterContainer />
      </QueryClientProvider>
    </Provider>
  );
}
