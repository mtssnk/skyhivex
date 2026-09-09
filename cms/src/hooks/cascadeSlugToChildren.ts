import type { CollectionAfterChangeHook } from 'payload'

/**
 * When a page's slug changes, re-derive every descendant's slug.
 *
 * The `slug` field's own `beforeValidate` hook only ever prepends the
 * **immediate** parent's stored slug — it never re-runs on children when an
 * ancestor is added or moved. So a page saved before its parent got a parent
 * keeps a stale prefix (e.g. `northwest-states/washington` instead of
 * `localised-test-page/northwest-states/washington`).
 *
 * This hook closes that gap: on a published slug change it re-saves each direct
 * child, passing the child's current slug straight through so the child's
 * `beforeValidate` recomputes it against the now-updated parent. Each of those
 * saves fires this hook again, so the whole subtree converges. Recursion stops
 * naturally once a re-save resolves a slug unchanged; a per-request visited set
 * guards against a `parent` cycle in bad data.
 */
export const cascadeSlugToChildren: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  if (operation !== 'update' || !previousDoc || doc.slug === previousDoc.slug) return doc
  if ('_status' in doc && doc._status !== 'published') return doc

  const ctx = req.context as { cascadeSlugVisited?: Set<string> }
  ctx.cascadeSlugVisited ??= new Set()
  ctx.cascadeSlugVisited.add(String(doc.id))

  const { docs: children } = await req.payload.find({
    collection: 'pages',
    where: { parent: { equals: doc.id } },
    limit: 1000,
    depth: 0,
    req,
  })

  for (const child of children) {
    if (ctx.cascadeSlugVisited.has(String(child.id))) continue
    await req.payload.update({
      collection: 'pages',
      id: child.id,
      // beforeValidate recomputes the full path from the updated parent.
      data: { slug: child.slug as string },
      req,
    })
  }

  return doc
}
