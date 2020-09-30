import loadIdeas from '@/components/ideasList/loadIdeas'
import { ORDER } from '@/components/ideasList/ideasOrdering'
import getPublicIdeasForQueue from '~/graphql/query/getPublicIdeasForQueue'

export async function getTopIdeas(api, nextToken) {
  //
  // This needs to call the get
  // Temporary sorting on the frontend for now to test
  //
  const ideas = await getNewIdeas(api, nextToken)
  ideas.ideas = ideas.ideas.sort(
    (first, second) => first.likesCount < second.likesCount
  )

  return ideas
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
