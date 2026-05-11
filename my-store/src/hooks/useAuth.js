import { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password) => {
    if (!supabase) throw new Error('Supabase 未配置');
    const result = await supabase.auth.signUp({ email, password });
    return result;
  };

  const signIn = async (email, password) => {
    if (!supabase) throw new Error('Supabase 未配置');
    const result = await supabase.auth.signInWithPassword({ email, password });
    return result;
  };

  const signOut = async () => {
    if (!supabase) throw new Error('Supabase 未配置');
    await supabase.auth.signOut();
  };

  return { user, signUp, signIn, signOut };
}
