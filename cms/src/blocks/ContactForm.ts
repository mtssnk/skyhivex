import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const ContactForm: Block = {
  slug: 'contactForm',
  labels: { singular: 'Contact Form', plural: 'Contact Form Blocks' },
  imageURL: '/assets/block-thumbnails/contact-form-preview.jpg',
  fields: withBlockTabs([
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'showContactDetails',
      type: 'checkbox',
      label: 'Show contact details',
      defaultValue: true,
      admin: {
        description: 'Displays phone, email, and address from Site Settings.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      admin: {
        description:
          'When set, switches to a two-column layout (details/body left, form right). When empty, uses a single-column layout.',
      },
    },
  ]),
}
