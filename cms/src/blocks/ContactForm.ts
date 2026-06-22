import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const ContactForm: Block = {
  slug: 'contactForm',
  labels: { singular: 'Contact Form', plural: 'Contact Forms' },
  fields: withBlockTabs([
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro',
    },
  ]),
}
