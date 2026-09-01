import type { CollectionAfterChangeHook } from 'payload'
import type { Post } from '../payload-types'

export const enforceSingleSticky: CollectionAfterChangeHook<Post> = async ({ doc, req }) => {
  if (!doc.sticky || doc._status !== 'published') return doc

  await req.payload.update({
    collection: 'posts',
    where: {
      and: [{ sticky: { equals: true } }, { id: { not_equals: doc.id } }],
    },
    data: { sticky: false },
    req,
  })

  return doc
}
