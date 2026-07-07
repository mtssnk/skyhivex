type ButtonLinkUrl =
  | { relationTo: 'pages' | 'projects' | 'posts'; value: { id: string; slug: string } | string }
  | string
  | null
  | undefined

export function resolveButtonHref(linkUrl: ButtonLinkUrl): string {
  if (!linkUrl) return '#'
  if (typeof linkUrl === 'string') return linkUrl
  const { relationTo, value } = linkUrl
  if (typeof value === 'string') return '#'
  if (relationTo === 'pages') return value.slug === 'home' ? '/' : `/${value.slug}`
  if (relationTo === 'projects') return `/projects/${value.slug}`
  if (relationTo === 'posts') return `/news/${value.slug}`
  return '#'
}

export function injectSpans(text: string, spanClass = 'font-semibold'): string {
  return text.replace(/\{\{(.+?)\}\}/g, `<span class="${spanClass}">$1</span>`)
}

const paddingClasses: Record<string, Record<string, string>> = {
  both: { xl: 'py-xl', lg: 'py-lg', md: 'py-md', sm: 'py-sm' },
  top: { xl: 'pt-xl', lg: 'pt-lg', md: 'pt-md', sm: 'pt-sm' },
  bottom: { xl: 'pb-xl', lg: 'pb-lg', md: 'pb-md', sm: 'pb-sm' },
}

export function blockPaddingClass(
  where: 'top' | 'bottom' | 'both' | null | undefined = 'both',
  size: 'xl' | 'lg' | 'md' | 'sm' | null | undefined = 'lg',
): string {
  return paddingClasses[where ?? 'both'][size ?? 'lg']
}
