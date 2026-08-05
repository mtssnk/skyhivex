import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

const RAILWAY_API_URL = 'https://backboard.railway.com/graphql/v2'

async function triggerWebDeploy(reason: string): Promise<void> {
  const token = process.env.RAILWAY_API_TOKEN
  const serviceId = process.env.RAILWAY_WEB_SERVICE_ID
  const environmentId = process.env.RAILWAY_ENVIRONMENT_ID

  if (!token || !serviceId || !environmentId) return

  try {
    const res = await fetch(RAILWAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `mutation ($serviceId: String!, $environmentId: String!) {
          serviceInstanceRedeploy(serviceId: $serviceId, environmentId: $environmentId)
        }`,
        variables: { serviceId, environmentId },
      }),
    })

    const json = await res.json()
    if (!res.ok || json.errors) {
      console.error(`[triggerWebDeploy] Railway redeploy failed (${reason}):`, json.errors ?? res.statusText)
    } else {
      console.log(`[triggerWebDeploy] Web redeploy triggered (${reason})`)
    }
  } catch (err) {
    console.error(`[triggerWebDeploy] Railway redeploy request failed (${reason}):`, err)
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
