export function normalizeExternalUrl(input: string) {
  const value = input.trim();
  if (!value) return '';

  // If already absolute, keep it.
  if (/^https?:\/\//i.test(value)) return value;

  // If user pasted something like "www.example.com", make it absolute.
  return `https://${value}`;
}
