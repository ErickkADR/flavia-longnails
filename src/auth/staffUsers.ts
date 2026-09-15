export interface StaffUser {
  username: string;
  email: string;
  name: string;
  /** Flávia é a proprietária do studio — só ela enxerga os gastos pessoais das outras. */
  isOwner: boolean;
}

/**
 * O login pede "usuário e senha", mas o Supabase Auth trabalha com e-mail.
 * Mapeamos um nome de usuário simples para um e-mail fixo por profissional —
 * esses e-mails não precisam ser reais/entregáveis, só existir como
 * identificador único no Supabase Auth.
 */
export const STAFF_USERS: StaffUser[] = [
  { username: 'flavia', email: 'flavia@studioflaviaalves.app', name: 'Flávia', isOwner: true },
  { username: 'jheny', email: 'jheny@studioflaviaalves.app', name: 'Jheny', isOwner: false },
  { username: 'vitoria', email: 'vitoria@studioflaviaalves.app', name: 'Vitória', isOwner: false },
  // Adicionada em 15/09/2026. O e-mail segue o mesmo domínio fixo dos outros 3
  // (não é texto de marca, é só identificador no Supabase Auth — ver CLAUDE.md).
  { username: 'mayte', email: 'mayte@studioflaviaalves.app', name: 'Mayte', isOwner: false },
];

export function emailForUsername(username: string): string | null {
  const match = STAFF_USERS.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
  return match?.email ?? null;
}

export function staffForEmail(email: string | null | undefined): StaffUser | null {
  return STAFF_USERS.find((u) => u.email.toLowerCase() === (email ?? '').toLowerCase()) ?? null;
}
