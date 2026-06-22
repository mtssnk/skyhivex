type MediaSize = {
  url?: string | null
  width?: number | null
  height?: number | null
}

export type Media = {
  id: string
  url?: string | null
  alt: string
  mimeType?: string | null
  width?: number | null
  height?: number | null
  sizes?: {
    xs?: MediaSize
    sm?: MediaSize
    md?: MediaSize
    lg?: MediaSize
    xl?: MediaSize
  } | null
}

export type Svg = {
  id: string
  name: string
  code: string
}

export type LexicalContent = {
  root: {
    type: string
    children: LexicalNode[]
    direction: 'ltr' | 'rtl' | null
    format: string
    indent: number
    version: number
  }
}

export type LexicalNode = {
  type: string
  version: number
  [key: string]: unknown
}

export type Work = {
  id: string
  title: string
  client: string
  projectName: string
  prefix?: string | null
  slug: string
  listingMedia: Media
  heroMedia?: Media | null
  services?: { service: string; id?: string | null }[] | null
  url?: string | null
  body?: WorkBlock[] | null
  featured?: boolean | null
  isDark?: boolean | null
  metaDescription?: string | null
  ogImage?: Media | null
}

type BlockPadding = {
  anchorId?: string | null
  paddingWhere?: 'both' | 'top' | 'bottom' | null
  paddingSize?: 'xl' | 'lg' | 'md' | 'sm' | null
}

export type MediaTextBlock = BlockPadding & {
  blockType: 'mediaText'
  id?: string | null
  media: Media
  text: LexicalContent
  mediaPosition: 'left' | 'right'
  aspectRatio?: 'auto' | '16/9' | '4/3' | '1/1' | null
  verticallyCentreText?: boolean | null
}

export type MediaBlock = BlockPadding & {
  blockType: 'media'
  id?: string | null
  media: Media
  aspectRatio?: 'auto' | '16/9' | '4/3' | '1/1' | null
}

export type QuoteBlock = BlockPadding & {
  blockType: 'quote'
  id?: string | null
  quote: string
  attribution?: string | null
}

export type WorkBlock = MediaTextBlock | MediaBlock | QuoteBlock

export type HeroBlock = BlockPadding & {
  blockType: 'hero'
  id?: string | null
  backgroundMedia?: Media | null
  prefix?: string | null
  heading: string
  intro?: string | null
  buttons?:
    | {
        label: string
        type: 'page' | 'scroll' | 'video'
        url?: string | null
        anchorId?: string | null
        videoUrl?: Media | null
        target?: '_blank' | null
        id?: string | null
      }[]
    | null
}

export type LogoListBlock = BlockPadding & {
  blockType: 'logoList'
  id?: string | null
  heading: string
  logos: Svg[]
}

export type WorkListBlock = BlockPadding & {
  heading?: string
  blockType: 'workList'
  id?: string | null
  works: Work[]
  viewAllLabel?: string | null
}

export type CardListBlock = BlockPadding & {
  blockType: 'cardList'
  id?: string | null
  heading: string
  cards: {
    icon?: Svg | null
    heading: string
    body: string
    id?: string | null
  }[]
}

export type ContactFormBlock = BlockPadding & {
  blockType: 'contactForm'
  id?: string | null
  heading: string
  intro?: string | null
}

export type PageBlock =
  | HeroBlock
  | LogoListBlock
  | WorkListBlock
  | CardListBlock
  | ContactFormBlock
  | MediaTextBlock
  | MediaBlock
  | QuoteBlock

export type Page = {
  id: string
  title: string
  slug: string
  isDark?: boolean | null
  blocks?: PageBlock[] | null
  metaDescription?: string | null
  ogImage?: Media | null
}

export type WorkPage = {
  heading?: string | null
  intro?: string | null
  blocks?: PageBlock[] | null
  metaDescription?: string | null
  ogImage?: Media | null
}

export type SocialPlatform = 'instagram' | 'linkedin'

type NavLinkType = 'page' | 'work' | 'url'

type NavLink = {
  label: string
  type: NavLinkType
  page?: { slug: string } | null
  url?: string | null
  id?: string | null
}

export type Navigation = {
  links?: NavLink[] | null
  button?: {
    enabled?: boolean | null
    label?: string | null
    type?: NavLinkType | null
    page?: { slug: string } | null
    url?: string | null
  } | null
}

export type SiteSettings = {
  contactName?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  logo?: Media | null
  socialLinks?: { platform: SocialPlatform; url: string; id?: string | null }[] | null
  legalLinks?: { label: string; url: string; id?: string | null }[] | null
  adobeFontsId?: string | null
  allowIndexing?: boolean | null
}

const CMS_URL = import.meta.env.CMS_URL as string
if (!CMS_URL?.startsWith('http')) {
  console.error(
    `[payload] CMS_URL is missing or has no protocol: "${CMS_URL}" — all CMS fetches will fail. Set CMS_URL=https://... in your environment variables.`,
  )
}

async function get<T>(
  path: string,
  params: Record<string, string> = {},
  headers: Record<string, string> = {},
): Promise<T | null> {
  try {
    const url = new URL(`${CMS_URL}/api${path}`)
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
    const res = await fetch(url, { headers, cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getPageBySlug(
  slug: string,
  { draft = false, apiKey }: { draft?: boolean; apiKey?: string } = {},
): Promise<Page | null> {
  const params: Record<string, string> = {
    'where[slug][equals]': slug,
    depth: '2',
    limit: '1',
  }
  if (draft) params.draft = 'true'
  const headers: Record<string, string> = apiKey ? { Authorization: `users API-Key ${apiKey}` } : {}
  const data = await get<{ docs: Page[] }>('/pages', params, headers)
  return data?.docs[0] ?? null
}

export async function getWork(): Promise<Work[]> {
  const data = await get<{ docs: Work[] }>('/work', {
    depth: '1',
    limit: '100',
    sort: '-createdAt',
  })
  return data?.docs ?? []
}

export async function getWorkBySlug(
  slug: string,
  { draft = false, apiKey }: { draft?: boolean; apiKey?: string } = {},
): Promise<Work | null> {
  const params: Record<string, string> = {
    'where[slug][equals]': slug,
    depth: '1',
    limit: '1',
  }
  if (draft) params.draft = 'true'
  const headers: Record<string, string> = apiKey ? { Authorization: `users API-Key ${apiKey}` } : {}
  const data = await get<{ docs: Work[] }>('/work', params, headers)
  return data?.docs[0] ?? null
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return get<SiteSettings>('/globals/site-settings')
}

export async function getNavigation(): Promise<Navigation | null> {
  return get<Navigation>('/globals/navigation', { depth: '1' })
}

export async function getWorkPage(): Promise<WorkPage | null> {
  return get<WorkPage>('/globals/work-page')
}
