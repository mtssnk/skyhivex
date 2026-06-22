import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero Blocks' },
  fields: withBlockTabs([
    {
      name: 'title',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Wrap text in {{double curly braces}} to apply serif/italic emphasis style.',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
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
    {
      name: 'overlayAlpha',
      type: 'number',
      min: 0,
      max: 1,
      admin: {
        description: 'Dark overlay opacity (0–1) to improve text contrast.',
        step: 0.05,
      },
    },
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
