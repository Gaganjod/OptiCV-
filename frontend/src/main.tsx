import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient();

// Force dark mode on body
document.documentElement.classList.add('dark');

import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {PUBLISHABLE_KEY ? (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <App />
        </ClerkProvider>
      ) : (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8 text-center">
          <div>
            <h1 className="text-2xl font-bold text-orange-500 mb-4">Clerk Authentication Missing</h1>
            <p className="text-slate-300 max-w-md mx-auto">
              To enable User Accounts and History, please create a free Clerk.com account and add your <code>VITE_CLERK_PUBLISHABLE_KEY</code> to the <code>.env</code> file in the root directory.
            </p>
            <p className="mt-4 text-sm text-slate-500">
              (If you are developing locally, restart your server after adding the key.)
            </p>
          </div>
        </div>
      )}
    </QueryClientProvider>
  </StrictMode>,
)
