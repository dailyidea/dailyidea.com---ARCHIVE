import loadIdeas from '@/components/ideasList/loadIdeas'
import { ORDER } from '@/components/ideasList/ideasOrdering'
import getPublicIdeasForQueue from '~/graphql/query/getPublicIdeasForQueue'

export default async function getAllIdeas(api, nextToken) {
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
