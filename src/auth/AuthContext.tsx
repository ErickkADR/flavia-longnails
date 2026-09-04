import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { emailForUsername, nameForEmail } from './staffUsers';

interface AuthState {
  loading: boolean;
  session: Session | null;
  name: string;
  signIn: (username: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signIn(username: string, password: string): Promise<string | null> {
    if (!supabase) return 'Supabase ainda não foi configurado neste ambiente.';
    const email = emailForUsername(username);
    if (!email) return 'Usuário não encontrado.';
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return 'Usuário ou senha incorretos.';
    return null;
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  const name = nameForEmail(session?.user.email);

  return (
    <AuthContext.Provider value={{ loading, session, name, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}

export { supabaseConfigured };
