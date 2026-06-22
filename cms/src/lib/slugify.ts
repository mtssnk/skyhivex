/**
 * Converts a string into a valid HTML anchor ID.
 * Lowercases, replaces whitespace with hyphens, strips invalid characters.
 */
export const slugifyAnchor = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
