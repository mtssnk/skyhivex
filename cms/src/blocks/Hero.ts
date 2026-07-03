import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'
import { overlayAlphaField } from '../fields/overlayAlpha'

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero Blocks' },
  fields: withBlockTabs([
    {
      name: 'headingPart1',
      type: 'textarea',
      required: true,
    },
    {
      name: 'headingPart2',
      type: 'text',
    },
    {
      name: 'intro',
      type: 'textarea',
    },
    {
      name: 'body',
      type: 'textarea',
      admin: {
        description:
          'Body text in body font — for content-heavy heroes (e.g. FAQs). Not used alongside intro.',
      },
    },
    {
      name: 'backgroundMedia',
      type: 'select',
      required: true,
      defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Shader', value: 'shader' },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, sibling) => sibling?.backgroundMedia === 'image',
      },
    },
    {
      name: 'backgroundVideo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Muted, looped, autoplayed as background.',
        condition: (_, sibling) => sibling?.backgroundMedia === 'video',
      },
    },
    overlayAlphaField(),
    {
      name: 'buttons',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'link',
          options: [
            { label: 'Page link', value: 'link' },
            { label: 'Scroll to section', value: 'anchor' },
            { label: 'Open video', value: 'video' },
          ],
        },
        {
          name: 'linkUrl',
          type: 'text',
          admin: {
            condition: (_, sibling) => sibling?.type === 'link',
          },
        },
        {
          name: 'anchorTarget',
          type: 'text',
          label: 'Anchor ID',
          admin: {
            description: 'CSS ID of the target element, without the # symbol.',
            condition: (_, sibling) => sibling?.type === 'anchor',
          },
        },
        {
          name: 'videoFile',
          type: 'upload',
          relationTo: 'media',
          label: 'Video',
          admin: {
            description: 'Opens unmuted in a dialog.',
            condition: (_, sibling) => sibling?.type === 'video',
          },
        },
        {
          name: 'variant',
          type: 'select',
          required: true,
          defaultValue: 'solid',
          options: [
            { label: 'Solid', value: 'solid' },
            { label: 'Outline', value: 'outline' },
          ],
        },
        {
          name: 'colour',
          type: 'select',
          required: true,
          defaultValue: 'white',
          options: [
            { label: 'White', value: 'white' },
            { label: 'Green', value: 'green' },
          ],
        },
      ],
    },
  ]),
}
