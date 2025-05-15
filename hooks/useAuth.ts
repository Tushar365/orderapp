'use client';

import { useConvexAuth } from 'convex/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

/**
 * React hook that manages authentication state and user data synchronization using Convex and Clerk.
 *
 * Integrates Convex and Clerk authentication systems to provide unified loading and authentication status, fetches user data from Convex, and ensures user data is stored in the database when authenticated. Exposes authentication state, user information from both systems, error state, and helper functions for access and role checks.
 *
 * @returns An object containing authentication status, loading state, user data from Convex and Clerk, authentication error state, user storage status, and helper functions for admin and role checks.
 */
export function useAuth() {
  const { isLoading: convexLoading, isAuthenticated } = useConvexAuth();
  const { isLoaded: clerkLoaded, user: clerkUser } = useUser();
  const [authError, setAuthError] = useState<string | null>(null);
  const [userStored, setUserStored] = useState<boolean>(false);
  
  const user = useQuery(api.users.getCurrentUser);
  const storeUser = useMutation(api.users.storeUser);

  // Determine overall loading state from both Clerk and Convex
  const isLoading = convexLoading || !clerkLoaded;

  // Store user data in the database when authenticated
  useEffect(() => {
    // Only attempt to store user if authenticated and not already stored
    if (isAuthenticated && !isLoading && clerkUser && !userStored) {
      console.log('Attempting to store user data:', {
        authenticated: isAuthenticated,
        clerkLoaded,
        convexLoaded: !convexLoading,
        clerkUser: clerkUser ? { id: clerkUser.id, email: clerkUser.emailAddresses[0]?.emailAddress } : null
      });
      
      try {
        storeUser()
          .then(result => {
            console.log('User data stored successfully:', result);
            setUserStored(true);
          })
          .catch(error => {
            console.error('Failed to store user data:', error);
            setAuthError('Failed to sync user data');
          });
      } catch (error) {
        console.error('Error in authentication flow:', error);
        setAuthError('Authentication error');
      }
    }
  }, [isAuthenticated, isLoading, storeUser, clerkUser, userStored]);

  // Reset userStored state if authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      setUserStored(false);
    }
  }, [isAuthenticated]);

  return {
    isLoading,
    isAuthenticated,
    user,
    clerkUser,
    authError,
    userStored,
    // Helper functions
    isAdmin: () => user?.email?.endsWith('@admin.com') || false,
    hasAccess: () => isAuthenticated && !isLoading,
    // Additional helper for checking specific roles
    hasRole: (role: string) => {
      if (!isAuthenticated || isLoading || !user) return false;
      // This is a placeholder - implement actual role checking based on your data model
      if (role === 'admin') return user?.email?.endsWith('@admin.com') || false;
      return false;
    },
    // Clear any auth errors
    clearAuthError: () => setAuthError(null),
  };
}

