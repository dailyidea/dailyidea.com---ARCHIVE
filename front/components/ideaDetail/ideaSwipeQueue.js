import loadIdeas from '@/components/ideasList/loadIdeas'
import { ORDER } from '@/components/ideasList/ideasOrdering'
import getPublicIdeas from '~/graphql/query/getPublicIdeas'

export default async function getAllIdeas(api) {
  const order = ORDER.DATE_DESC
  const data = await loadIdeas(
    api,
    'getPublicIdeas',
    getPublicIdeas,
    { order },
    'API_KEY'
  )
  data.order = order
  return data
}
