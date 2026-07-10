import type { Block, Field } from 'payload'
import { withBlockTabs } from './fields/blockFields'
import { overlayAlphaField } from '../fields/overlayAlpha'
import { headingTagField } from '../fields/headingTag'

export const heroFields: Field[] = [
  {
    type: 'collapsible',
    label: 'Text',
    admin: {
      initCollapsed: false,
    },
    fields: [
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
        type: 'richText',
      },
    ],
  },
  {
    type: 'collapsible',
    label: 'Background',
    admin: {
      initCollapsed: false,
    },
    fields: [
      {
        label: 'Background',
        name: 'backgroundMedia',
        type: 'select',
        required: true,
        defaultValue: 'image',
        options: [
          { label: 'Image', value: 'image' },
          { label: 'Video', value: 'video' },
          { label: 'Shader', value: 'shader' },
          { label: 'Hexagon pattern', value: 'hexagon' },
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
      overlayAlphaField({
        defaultValue: 0.4,
        condition: (_, sibling) =>
          sibling?.backgroundMedia === 'image' || sibling?.backgroundMedia === 'video',
      }),
    ],
  },
  {
    type: 'collapsible',
    label: 'Buttons',
    admin: {
      initCollapsed: false,
    },
    fields: [
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
            type: 'relationship',
            relationTo: ['pages', 'projects', 'posts'],
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
    ],
  },
]

export const heroSizeField: Field = {
  name: 'size',
  type: 'select',
  required: true,
  defaultValue: 'large',
  options: [
    { label: 'Large', value: 'large' },
    { label: 'Medium', value: 'medium' },
    { label: 'Small', value: 'small' },
  ],
}

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero Blocks' },
  fields: withBlockTabs(heroFields, {
    padding: false,
    extra: [heroSizeField, headingTagField({ defaultValue: 'h1' })],
  }),
}
