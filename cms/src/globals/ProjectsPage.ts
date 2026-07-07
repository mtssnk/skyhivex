import type { GlobalConfig } from 'payload'
import { heroFields, projectsPageBlocks } from '../blocks'

export const ProjectsPage: GlobalConfig = {
  slug: 'projects-page',
  label: 'Projects listing',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: heroFields,
      admin: {
        description:
          'The project list Anchor ID is project-list. Use this ID for the scroll to section Anchor ID.',
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Additional content (after project list)',
      blocks: projectsPageBlocks,
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'SEO meta description (max 160 characters).',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description: 'Social share image (OG). Recommended: 1200×630px.',
      },
    },
  ],
}
