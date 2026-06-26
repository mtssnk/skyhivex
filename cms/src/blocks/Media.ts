import type { Block } from 'payload'
import { headingStyleField, withBlockTabs } from './fields/blockFields'

export const Media: Block = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media Blocks' },
  fields: withBlockTabs([
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
        description: 'Muted, looped, autoplayed as background.',
        condition: (_, sibling) => sibling?.mediaType === 'video',
      },
    },
    {
      name: 'openVideo',
      type: 'upload',
      relationTo: 'media',
      label: 'Dialog video',
      admin: {
        description: 'If set, a play button opens this video unmuted in a dialog.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        condition: (_, sibling) => Boolean(sibling?.openVideo),
      },
    },
    {
      name: 'overlayAlpha',
      type: 'number',
      min: 0,
      max: 1,
      admin: {
        description: 'Dark overlay opacity (0–1). Only relevant when heading is set.',
        step: 0.05,
        condition: (_, sibling) => Boolean(sibling?.heading) && Boolean(sibling?.openVideo),
      },
    },
    {
      name: 'size',
      type: 'select',
      required: true,
      defaultValue: 'large',
      options: [
        { label: 'Full screen', value: 'fullscreen' },
        { label: 'Large (container width)', value: 'large' },
        { label: 'Small', value: 'small' },
      ],
    },
    {
      name: 'aspectRatio',
      type: 'select',
      defaultValue: 'auto',
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
