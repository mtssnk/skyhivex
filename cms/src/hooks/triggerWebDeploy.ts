import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

const GITHUB_API_URL = 'https://api.github.com'

// Any path inside web/ works — committing to it is what busts Railway's build cache,
// since a genuinely fresh commit (unlike calling Railway's deploy API on an unchanged
// commit) is the only thing that reliably makes Railpack/BuildKit re-run `pnpm build`
// and re-fetch CMS content. Calling Railway's API directly reuses the last build output
// when no files changed, no matter which mutation or cache-control env var is used.
const TRIGGER_FILE_PATH = 'web/.build-trigger'

async function triggerWebDeploy(reason: string): Promise<void> {
  const token = process.env.SKYHIVEX_DEPLOY_GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'

  if (!token || !repo) return

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  }
  const contentsUrl = `${GITHUB_API_URL}/repos/${repo}/contents/${TRIGGER_FILE_PATH}`

  try {
    const getRes = await fetch(`${contentsUrl}?ref=${branch}`, { headers })
    const sha = getRes.ok ? (await getRes.json()).sha : undefined

    const putRes = await fetch(contentsUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `chore: trigger web rebuild (${reason})`,
        content: Buffer.from(new Date().toISOString()).toString('base64'),
        branch,
        ...(sha ? { sha } : {}),
      }),
    })

    const json = await putRes.json()
    if (!putRes.ok) {
      console.error(`[triggerWebDeploy] GitHub commit failed (${reason}):`, json)
    } else {
      console.log(`[triggerWebDeploy] Web rebuild triggered via commit (${reason})`)
    }
  } catch (err) {
    console.error(`[triggerWebDeploy] GitHub request failed (${reason}):`, err)
  }
}

export const afterChangeTriggerDeploy: CollectionAfterChangeHook = async ({ doc, collection }) => {
  if ('_status' in doc && doc._status !== 'published') return doc
  void triggerWebDeploy(`${collection.slug} afterChange`)
  return doc
}

export const afterDeleteTriggerDeploy: CollectionAfterDeleteHook = async ({ doc, collection }) => {
  void triggerWebDeploy(`${collection.slug} afterDelete`)
  return doc
}

export const globalAfterChangeTriggerDeploy: GlobalAfterChangeHook = async ({ doc, global }) => {
  void triggerWebDeploy(`${global.slug} afterChange`)
  return doc
}
