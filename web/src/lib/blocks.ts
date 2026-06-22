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
