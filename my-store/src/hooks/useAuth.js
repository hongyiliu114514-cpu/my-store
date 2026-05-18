import { useState, useEffect, useCallback } from 'react';
import supabase from '../supabaseClient';

const REMEMBER_KEY = 'myStoreRememberMe';
const CRED_KEY = 'myStoreCreds';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    // 尝试自动登录
    const tryAutoLogin = async () => {
      const remember = localStorage.getItem(REMEMBER_KEY);
      if (remember === 'true') {
        const creds = localStorage.getItem(CRED_KEY);
        if (creds) {
          try {
            const { email, password } = JSON.parse(creds);
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
              // 自动登录失败，清除过期凭据
              localStorage.removeItem(CRED_KEY);
              localStorage.removeItem(REMEMBER_KEY);
            }
          } catch {
            localStorage.removeItem(CRED_KEY);
            localStorage.removeItem(REMEMBER_KEY);
          }
        }
      }
      // 无论自动登录是否成功，都获取当前用户状态
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
      setAuthReady(true);
    };

    tryAutoLogin();

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

  const signIn = useCallback(async (email, password, rememberMe = false) => {
    if (!supabase) throw new Error('Supabase 未配置');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // 记住我：保存凭据
    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY, 'true');
      localStorage.setItem(CRED_KEY, JSON.stringify({ email, password }));
    } else {
      localStorage.removeItem(REMEMBER_KEY);
      localStorage.removeItem(CRED_KEY);
    }

    return data;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) throw new Error('Supabase 未配置');
    // 退出时清除记住的凭据
    localStorage.removeItem(REMEMBER_KEY);
    localStorage.removeItem(CRED_KEY);
    await supabase.auth.signOut();
  }, []);

  return { user, authReady, signUp, signIn, signOut };
}
