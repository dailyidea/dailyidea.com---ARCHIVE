import loadIdeas from '@/components/ideasList/loadIdeas'
import { ORDER } from '@/components/ideasList/ideasOrdering'
import getPublicIdeasForQueue from '~/graphql/query/getPublicIdeasForQueue'

export async function getTopIdeas(api, nextToken) {
  const order = ORDER.LIKES
  const data = await loadIdeas(
    api,
    'getPublicIdeas',
    getPublicIdeasForQueue,
    { nextToken, order },
    'API_KEY'
  )

  return data
}

export async function getNewIdeas(api, nextToken) {
  const order = ORDER.DATE_DESC
  const data = await loadIdeas(
    api,
    'getPublicIdeas',
    getPublicIdeasForQueue,
    { nextToken, order },
    'API_KEY'
  )
  return data
}

export async function getFirstIdea(api) {
  const ideas = await getNewIdeas(api)

  if (ideas !== null && ideas.ideas) {
    return ideas.ideas[0]
  }

  return null
}
