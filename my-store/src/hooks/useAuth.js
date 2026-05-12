import { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    }).catch(() => {
      // 未登录或 token 过期，忽略
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
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    if (!supabase) throw new Error('Supabase 未配置');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    if (!supabase) throw new Error('Supabase 未配置');
    await supabase.auth.signOut();
  };

  return { user, signUp, signIn, signOut };
}
