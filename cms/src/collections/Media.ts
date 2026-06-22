import type { CollectionConfig } from 'payload'

const webpOptions = { format: 'webp' as const, options: { quality: 82 } }

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    imageSizes: [
      { name: 'xs', width: 480, formatOptions: webpOptions },
      { name: 'sm', width: 800, formatOptions: webpOptions },
      { name: 'md', width: 1200, formatOptions: webpOptions },
      { name: 'lg', width: 1600, formatOptions: webpOptions },
      { name: 'xl', width: 2400, formatOptions: webpOptions },
    ],
    adminThumbnail: 'sm',
  },
}
