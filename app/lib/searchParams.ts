export function applyParams(
  base: string | Record<string, string>,
  updates: Record<string, string | undefined> = {},
): URLSearchParams {
  const params = new URLSearchParams(base as Record<string, string>);
  for (const [key, value] of Object.entries(updates)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }
  return params;
}
