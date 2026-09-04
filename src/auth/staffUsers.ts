export interface StaffUser {
  username: string;
  email: string;
  name: string;
}

/**
 * O login pede "usuário e senha", mas o Supabase Auth trabalha com e-mail.
 * Mapeamos um nome de usuário simples para um e-mail fixo por profissional —
 * esses e-mails não precisam ser reais/entregáveis, só existir como
 * identificador único no Supabase Auth.
 */
export const STAFF_USERS: StaffUser[] = [
  { username: 'flavia', email: 'flavia@studioflaviaalves.app', name: 'Flávia' },
  { username: 'jheny', email: 'jheny@studioflaviaalves.app', name: 'Jheny' },
  { username: 'vitoria', email: 'vitoria@studioflaviaalves.app', name: 'Vitória' },
];

export function emailForUsername(username: string): string | null {
  const match = STAFF_USERS.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
  return match?.email ?? null;
}

export function nameForEmail(email: string | null | undefined): string {
  const match = STAFF_USERS.find((u) => u.email.toLowerCase() === (email ?? '').toLowerCase());
  return match?.name ?? 'Colaboradora';
}