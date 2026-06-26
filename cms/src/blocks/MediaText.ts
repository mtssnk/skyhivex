import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const MediaText: Block = {
  slug: 'mediaText',
  labels: { singular: 'Text and Media', plural: 'Text and Media Blocks' },
  fields: withBlockTabs([
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'contained',
      options: [
        { label: 'Contained', value: 'contained' },
        { label: 'Full width', value: 'split' },
      ],
    },
    {
      name: 'headingTag',
      type: 'select',
      defaultValue: 'h2',
      options: [
        { label: 'H1', value: 'h1' },
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
        { label: 'H4', value: 'h4' },
      ],
      admin: {
        condition: (_, sibling) => Boolean(sibling?.heading),
      },
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Wrap text in {{double curly braces}} to apply serif/italic emphasis style.',
      },
    },
    {
      name: 'body',
      type: 'richText',
    },
    {
      name: 'mediaPosition',
      type: 'select',
      required: true,
      defaultValue: 'left',
      options: [
        { label: 'Media on left', value: 'left' },
        { label: 'Media on right', value: 'right' },
      ],
    },
    {
      name: 'mediaType',
      type: 'select',
      required: true,
      defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, sibling) => sibling?.mediaType === 'image',
      },
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Muted, looped, autoplayed.',
        condition: (_, sibling) => sibling?.mediaType === 'video',
      },
    },
    {
      name: 'aspectRatio',
      type: 'select',
      defaultValue: 'auto',
      admin: {
        description: 'Only applies to the contained variant.',
        condition: (_, sibling) => sibling?.variant === 'contained',
      },
      options: [
        { label: 'Auto', value: 'auto' },
        { label: '4:3', value: '4/3' },
        { label: '16:9', value: '16/9' },
        { label: '1:1', value: '1/1' },
        { label: '3:4', value: '3/4' },
      ],
    },
  ]),
}
