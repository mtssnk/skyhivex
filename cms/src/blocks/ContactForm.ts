import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const ContactForm: Block = {
  slug: 'contactForm',
  labels: { singular: 'Contact Form', plural: 'Contact Form Blocks' },
  fields: withBlockTabs([
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'richText',
    },
  ]),
}
