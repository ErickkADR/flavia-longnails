/** Resolve um caminho de `public/` para a URL final, respeitando o base path do Vite (GitHub Pages). */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
