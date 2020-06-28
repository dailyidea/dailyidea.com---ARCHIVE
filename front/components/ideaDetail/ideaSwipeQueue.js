import loadIdeas from '@/components/ideasList/loadIdeas'
import { ORDER } from '@/components/ideasList/ideasOrdering'
import getPublicIdeas from '~/graphql/query/getPublicIdeas'

export default async function getAllIdeas(api, nextToken) {
  const order = ORDER.DATE_DESC
  const data = await loadIdeas(
    api,
    'getPublicIdeas',
    getPublicIdeas,
    { nextToken, order },
    'API_KEY'
  )
  return data
}
