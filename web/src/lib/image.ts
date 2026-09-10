/**
 * Cloudflare Image Transformations URL builder.
 *
 * When `PUBLIC_IMAGE_CDN_BASE` is set (e.g. `https://media.skyhivex.com/cdn-cgi/image`)
 * images are resized / cropped / re-encoded on the fly at the edge. When it's not
 * set, `cfImage()` returns the source URL untouched so `MediaItem.astro` can fall
 * back to the pre-generated Sharp sizes. See web/CLAUDE.md → "Images and
 * responsive delivery".
 */

const RAW_BASE = import.meta.env.PUBLIC_IMAGE_CDN_BASE as string | undefined
const CDN_BASE = RAW_BASE?.replace(/\/+$/, '') || null

/** True when Cloudflare Image Transformations are configured. */
export const imageCdnEnabled = CDN_BASE !== null

/** Width ladder for generated srcsets — 1x through ~2x on large displays. */
export const IMAGE_WIDTHS = [400, 800, 1200, 1600, 2000, 2400] as const

export const DEFAULT_QUALITY = 72

type Fit = 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad'

export interface CfImageOptions {
  width: number
  /** With `fit: 'cover'` this crops the source to width×height. */
  height?: number
  fit?: Fit
  /** Crop focus: a focal point `${x}x${y}` (0–1), or `auto` / `face`. */
  gravity?: string
  /** 1–100. Defaults to DEFAULT_QUALITY. */
  quality?: number
}

/**
 * Build a Cloudflare Image Transformations URL for `src` (a full image URL).
 * Returns `src` unchanged when the CDN base isn't configured.
 */
export function cfImage(src: string, opts: CfImageOptions): string {
  if (!CDN_BASE || !src) return src
  const params = [
    `width=${Math.round(opts.width)}`,
    `quality=${opts.quality ?? DEFAULT_QUALITY}`,
    'format=auto',
  ]
  if (opts.height != null) params.push(`height=${Math.round(opts.height)}`)
  if (opts.fit) params.push(`fit=${opts.fit}`)
  if (opts.gravity) params.push(`gravity=${opts.gravity}`)
  return `${CDN_BASE}/${params.join(',')}/${src}`
}

/** Gravity string from Payload focal-point fields (stored 0–100). */
export function focalGravity(focalX?: number | null, focalY?: number | null): string | undefined {
  if (focalX == null || focalY == null) return undefined
  return `${(focalX / 100).toFixed(4)}x${(focalY / 100).toFixed(4)}`
}

export interface SrcsetOptions {
  /** Crop every candidate to this aspect ratio (w/h) via `fit: 'cover'`. Omit for no crop. */
  ratio?: number
  gravity?: string
  quality?: number
  /** The source's real pixel width — caps the ladder so candidates never upscale. */
  maxWidth?: number | null
}

/**
 * Build a `srcset` across IMAGE_WIDTHS. With `ratio`, each candidate is a
 * `width × round(width / ratio)` crop; without it, width only (source ratio kept).
 */
export function buildSrcset(src: string, opts: SrcsetOptions = {}): string {
  const { ratio, gravity, quality, maxWidth } = opts
  let widths: number[] = maxWidth ? IMAGE_WIDTHS.filter((w) => w <= maxWidth) : [...IMAGE_WIDTHS]
  if (widths.length === 0) widths = [IMAGE_WIDTHS[0]]

  return widths
    .map((w) => {
      const url = cfImage(src, {
        width: w,
        height: ratio ? Math.round(w / ratio) : undefined,
        fit: ratio ? 'cover' : undefined,
        gravity: ratio ? gravity : undefined,
        quality,
      })
      return `${url} ${w}w`
    })
    .join(', ')
}
