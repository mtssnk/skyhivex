import type { GlobalConfig } from 'payload'
import { heroFields } from '../blocks/Hero'
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
import { FeatureList } from '../blocks/FeatureList'

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
        FeatureList,
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
