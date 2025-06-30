import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setProfileLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, !!session);
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user) {
          // For new signups, wait a moment for the trigger to create the profile
          if (event === 'SIGNED_UP') {
            setTimeout(() => loadUserProfile(session.user.id), 1000);
          } else {
            loadUserProfile(session.user.id);
          }
        } else {
          setUserProfile(null);
          setProfileLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string, retryCount = 0) => {
    setProfileLoading(true);
    try {
      console.log("Loading user profile for ID:", userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading user profile:', error);
        setUserProfile(null);
      } else if (profile) {
        console.log("Profile loaded successfully:", profile);
        setUserProfile(profile);
      } else if (retryCount < 3) {
        // Profile might not be created yet by the trigger, retry after a short delay
        console.log("Profile not found, retrying in 500ms...");
        setTimeout(() => loadUserProfile(userId, retryCount + 1), 500);
        return;
      } else {
        console.error('Profile not found after retries');
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
    } finally {
      if (retryCount === 0 || retryCount >= 3) {
        setProfileLoading(false);
      }
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    // Profile creation is now handled automatically by the database trigger
    // No need to manually create the profile here

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.data?.user) {
      await loadUserProfile(result.data.user.id);
    }
    return result;
  };

  const signOut = async () => {
    setUserProfile(null);
    return await supabase.auth.signOut();
  };

  return {
    user,
    userProfile,
    loading,
    profileLoading,
    signUp,
    signIn,
    signOut
  };
}