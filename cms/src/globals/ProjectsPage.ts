import type { GlobalConfig } from 'payload'
import { Hero } from '../blocks/Hero'
import { MediaText } from '../blocks/MediaText'
import { Media } from '../blocks/Media'
import { Quote } from '../blocks/Quote'
import { BodyCopy } from '../blocks/BodyCopy'
import { CTA } from '../blocks/CTA'
import { PersonList } from '../blocks/PersonList'
import { AccordionList } from '../blocks/AccordionList'
import { CardList } from '../blocks/CardList'
import { ProjectList } from '../blocks/ProjectList'
import { NewsCardList } from '../blocks/NewsCardList'
import { LogoList } from '../blocks/LogoList'

export const ProjectsPage: GlobalConfig = {
  slug: 'projects-page',
  label: 'Projects listing',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heading',
      type: 'textarea',
    },
    {
      name: 'intro',
      type: 'textarea',
    },
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Additional content (after project list)',
      blocks: [
        MediaText,
        Media,
        Quote,
        BodyCopy,
        CTA,
        PersonList,
        AccordionList,
        CardList,
        ProjectList,
        NewsCardList,
        LogoList,
      ],
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
