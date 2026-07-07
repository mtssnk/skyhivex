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

export type Category = {
  id: string
  name: string
  slug: string
}

export type Region = {
  id: string
  name: string
  slug: string
}

export type State = {
  id: string
  name: string
  slug: string
  region?: Region | null
}

export type City = {
  id: string
  name: string
  slug: string
  state?: State | null
  region?: Region | null
}

export type ClientType = {
  id: string
  name: string
  slug: string
}

export type NavigationItem = {
  id: string
  name: string
  links?:
    | {
        label: string
        page?: { id: string; slug: string; title: string } | null
        url?: string | null
        id?: string | null
      }[]
    | null
}

export type Project = {
  id: string
  heading: string
  projectName?: string | null
  slug: string
  clientType?: ClientType | null
  region?: Region | null
  state?: State | null
  city?: City | null
  listingImage: Media
  listingMedia?: Media | null
  heroMedia?: {
    backgroundMedia?: 'image' | 'video' | null
    image?: Media | null
    video?: Media | null
    overlayAlpha?: number | null
  } | null
  intro?: string | null
  summary?: { label: string; value: string; id?: string | null }[] | null
  body?: LexicalContent | null
  url?: string | null
  blocks?: ProjectBlock[] | null
  metaDescription?: string | null
  ogImage?: Media | null
}

export type Post = {
  id: string
  title: string
  slug: string
  categories?: Category[] | null
  regions?: Region[] | null
  states?: State[] | null
  cities?: City[] | null
  listingImage: Media
  overlayAlpha?: number | null
  blocks?: PostBlock[] | null
  metaDescription?: string | null
  ogImage?: Media | null
}

type BlockPadding = {
  anchorId?: string | null
  paddingWhere?: 'both' | 'top' | 'bottom' | null
  paddingSize?: 'xl' | 'lg' | 'md' | 'sm' | null
}

export type HeroBlock = BlockPadding & {
  blockType: 'hero'
  id?: string | null
  headingPart1: string
  headingPart2?: string | null
  intro?: string | null
  body?: string | null
  backgroundMedia?: 'image' | 'video' | 'shader' | null
  backgroundImage?: Media | null
  backgroundVideo?: Media | null
  overlayAlpha?: number | null
  buttons?:
    | {
        label: string
        type: 'link' | 'anchor' | 'video'
        linkUrl?:
          | { relationTo: 'pages' | 'projects' | 'posts'; value: { id: string; slug: string } | string }
          | string
          | null
        anchorTarget?: string | null
        videoFile?: Media | null
        variant: 'solid' | 'outline'
        colour: 'white' | 'green'
        id?: string | null
      }[]
    | null
}

export type MediaTextBlock = BlockPadding & {
  blockType: 'mediaText'
  id?: string | null
  variant: 'contained' | 'split'
  heading?: string | null
  headingTag?: 'h1' | 'h2' | 'h3' | 'h4' | null
  headingStyle?: string | null
  body?: LexicalContent | null
  linkLabel?: string | null
  linkType?: 'external' | 'internal' | null
  linkUrl?: string | null
  linkPage?: { id: string; slug: string; title: string } | null
  mediaPosition: 'left' | 'right'
  mediaType: 'image' | 'video'
  image?: Media | null
  video?: Media | null
  aspectRatio?: 'auto' | '4/3' | '16/9' | '1/1' | '3/4' | null
}

export type MediaBlock = BlockPadding & {
  blockType: 'media'
  id?: string | null
  mediaType: 'image' | 'video'
  image?: Media | null
  video?: Media | null
  openVideo?: Media | null
  heading?: string | null
  headingStyle?: string | null
  overlayAlpha?: number | null
  size: 'fullscreen' | 'large' | 'small'
  aspectRatio?: 'auto' | '4/3' | '16/9' | '1/1' | '3/4' | null
}

export type QuoteBlock = BlockPadding & {
  blockType: 'quote'
  id?: string | null
  quoteSize: 'small' | 'regular' | 'large'
  quote: string
  attribution?: string | null
}

export type CardListBlock = BlockPadding & {
  blockType: 'cardList'
  id?: string | null
  heading?: string | null
  cards: {
    illustration: string
    heading: string
    body?: LexicalContent | null
    id?: string | null
  }[]
  button?: {
    label?: string | null
    url?: string | null
  } | null
}

export type LogoListBlock = BlockPadding & {
  blockType: 'logoList'
  id?: string | null
  heading: string
  logos: Svg[]
}

export type ProjectListBlock = BlockPadding & {
  blockType: 'projectList'
  id?: string | null
  selectionMode: 'manual' | 'filtered' | 'latest'
  heading?: string | null
  viewAllLabel?: string | null
  projects?: Project[] | null
  filterClientType?: ClientType | null
  filterRegion?: Region | null
  filterState?: State | null
  filterCity?: City | null
  count?: number | null
  buttonLabel?: string | null
}

export type NewsCardListBlock = BlockPadding & {
  blockType: 'newsCardList'
  id?: string | null
  selectionMode: 'manual' | 'category' | 'by-geography' | 'latest'
  articles?: Post[] | null
  category?: Category | null
  filterRegion?: Region | null
  filterState?: State | null
  filterCity?: City | null
  buttonLabel?: string | null
}

export type BodyCopyBlock = BlockPadding & {
  blockType: 'bodyCopy'
  id?: string | null
  content: LexicalContent
}

export type CTABlock = BlockPadding & {
  blockType: 'cta'
  id?: string | null
  headingPart1?: string | null
  headingPart2?: string | null
  intro?: string | null
  body?: string | null
  backgroundMedia?: 'image' | 'video' | 'shader' | null
  backgroundImage?: Media | null
  backgroundVideo?: Media | null
  overlayAlpha?: number | null
  buttons?: HeroBlock['buttons']
}

export type PersonListBlock = BlockPadding & {
  blockType: 'personList'
  id?: string | null
  heading?: string | null
  body?: LexicalContent | null
  people: {
    image: Media
    cutoutImage?: boolean | null
    name: string
    role?: string | null
    description?: string | null
    id?: string | null
  }[]
}

export type AccordionListBlock = BlockPadding & {
  blockType: 'accordionList'
  id?: string | null
  items: {
    heading: string
    body: LexicalContent
    id?: string | null
  }[]
}

export type FeatureListBlock = BlockPadding & {
  blockType: 'featureList'
  id?: string | null
  heading?: string | null
  headingTag?: 'h1' | 'h2' | 'h3' | 'h4' | null
  items: {
    icon?: Svg | null
    heading: string
    body?: string | null
    id?: string | null
  }[]
  linkLabel?: string | null
  linkType?: 'internal' | 'external' | null
  linkUrl?: string | null
  linkPage?: { slug: string } | null
}

export type LinkedContentBlock = BlockPadding & {
  blockType: 'linkedContent'
  id?: string | null
  navigation?: NavigationItem | null
  body?: LexicalContent | null
}

export type NavBlockLink = {
  id?: string | null
  label: string
  page?: {
    relationTo: 'pages' | 'projects' | 'posts'
    value: { id: string; slug: string } | string
  } | null
  url?: string | null
}

export type NavigationBlock = BlockPadding & {
  blockType: 'navBlock'
  id?: string | null
  name?: string | null
  links?: NavBlockLink[] | null
}

export type SharedBlock =
  | MediaTextBlock
  | MediaBlock
  | QuoteBlock
  | BodyCopyBlock
  | CTABlock
  | PersonListBlock
  | AccordionListBlock
  | CardListBlock
  | ProjectListBlock
  | NewsCardListBlock
  | LogoListBlock
  | FeatureListBlock
  | LinkedContentBlock
  | NavigationBlock

export type PageBlock = HeroBlock | SharedBlock
export type ProjectBlock = SharedBlock
export type PostBlock = SharedBlock

export type Page = {
  id: string
  title: string
  slug: string
  parent?: { id: string; slug: string; title: string } | null
  regions?: Region[] | null
  states?: State[] | null
  cities?: City[] | null
  blocks?: PageBlock[] | null
  metaDescription?: string | null
  ogImage?: Media | null
}

export type ProjectsPageHero = {
  headingPart1?: string | null
  headingPart2?: string | null
  intro?: string | null
  body?: string | null
  backgroundMedia?: 'image' | 'video' | 'shader' | null
  backgroundImage?: Media | null
  backgroundVideo?: Media | null
  overlayAlpha?: number | null
  buttons?: HeroBlock['buttons']
}

export type ProjectsPage = {
  hero?: ProjectsPageHero | null
  blocks?: SharedBlock[] | null
  metaDescription?: string | null
  ogImage?: Media | null
}

export type ContactPage = {
  heading: string
  body?: LexicalContent | null
  metaDescription?: string | null
  ogImage?: Media | null
}

export type SocialPlatform = 'instagram' | 'linkedin' | 'x' | 'facebook' | 'youtube'

type NavLinkType = 'page' | 'projects' | 'news' | 'url'

type NavLink = {
  label: string
  type: NavLinkType
  page?: { slug: string } | null
  url?: string | null
  id?: string | null
}

export type Navigation = {
  header?: {
    links?: NavLink[] | null
    button?: {
      enabled?: boolean | null
      label?: string | null
      type?: NavLinkType | null
      page?: { slug: string } | null
      url?: string | null
    } | null
  } | null
  footer?: {
    nav1?: NavLink[] | null
    nav2?: NavLink[] | null
  } | null
}

export type SiteSettings = {
  companyName?: string | null
  contactName?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  contactAddress?: string | null
  googleMapsUrl?: string | null
  logo?: Media | null
  socialLinks?: { platform: SocialPlatform; url: string; id?: string | null }[] | null
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

export async function getPages(): Promise<Page[]> {
  const data = await get<{ docs: Page[] }>('/pages', { depth: '0', limit: '100' })
  return data?.docs ?? []
}

export async function getPageBySlug(
  slug: string,
  { draft = false, apiKey }: { draft?: boolean; apiKey?: string } = {},
): Promise<Page | null> {
  const params: Record<string, string> = {
    'where[slug][equals]': slug,
    depth: '3',
    limit: '1',
  }
  if (draft) params.draft = 'true'
  const headers: Record<string, string> = apiKey ? { Authorization: `users API-Key ${apiKey}` } : {}
  const data = await get<{ docs: Page[] }>('/pages', params, headers)
  return data?.docs[0] ?? null
}

export async function getProjects(): Promise<Project[]> {
  const data = await get<{ docs: Project[] }>('/projects', {
    depth: '1',
    limit: '100',
    sort: '-createdAt',
  })
  return data?.docs ?? []
}

export async function getProjectBySlug(
  slug: string,
  { draft = false, apiKey }: { draft?: boolean; apiKey?: string } = {},
): Promise<Project | null> {
  const params: Record<string, string> = {
    'where[slug][equals]': slug,
    depth: '2',
    limit: '1',
  }
  if (draft) params.draft = 'true'
  const headers: Record<string, string> = apiKey ? { Authorization: `users API-Key ${apiKey}` } : {}
  const data = await get<{ docs: Project[] }>('/projects', params, headers)
  return data?.docs[0] ?? null
}

export async function getPosts(): Promise<Post[]> {
  const data = await get<{ docs: Post[] }>('/posts', {
    depth: '1',
    limit: '100',
    sort: '-createdAt',
  })
  return data?.docs ?? []
}

export async function getPostBySlug(
  slug: string,
  { draft = false, apiKey }: { draft?: boolean; apiKey?: string } = {},
): Promise<Post | null> {
  const params: Record<string, string> = {
    'where[slug][equals]': slug,
    depth: '2',
    limit: '1',
  }
  if (draft) params.draft = 'true'
  const headers: Record<string, string> = apiKey ? { Authorization: `users API-Key ${apiKey}` } : {}
  const data = await get<{ docs: Post[] }>('/posts', params, headers)
  return data?.docs[0] ?? null
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return get<SiteSettings>('/globals/site-settings')
}

export async function getNavigation(): Promise<Navigation | null> {
  return get<Navigation>('/globals/navigation', { depth: '1' })
}

export async function getProjectsPage(): Promise<ProjectsPage | null> {
  return get<ProjectsPage>('/globals/projects-page')
}

export async function getContactPage(): Promise<ContactPage | null> {
  return get<ContactPage>('/globals/contact-page')
}

export async function getRegions(): Promise<Region[]> {
  const data = await get<{ docs: Region[] }>('/regions', { depth: '0', limit: '200' })
  return data?.docs ?? []
}

export async function getStates(): Promise<State[]> {
  const data = await get<{ docs: State[] }>('/states', { depth: '1', limit: '200' })
  return data?.docs ?? []
}

export async function getCities(): Promise<City[]> {
  const data = await get<{ docs: City[] }>('/cities', { depth: '1', limit: '500' })
  return data?.docs ?? []
}

export async function getClientTypes(): Promise<ClientType[]> {
  const data = await get<{ docs: ClientType[] }>('/client-types', { depth: '0', limit: '200' })
  return data?.docs ?? []
}
