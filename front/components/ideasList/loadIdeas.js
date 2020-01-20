const pageSize = 25

async function loadIdeas(
  api,
  queryName,
  query,
  customVariables = {},
  authMode = undefined
) {
  const variables = Object.assign(
    {
      limit: pageSize
    },
    customVariables
  )
  const result = await api.graphql({
    query,
    variables,
    authMode
  })
  const ideas = result.data[queryName]
  return {
    ideas: ideas.items,
    nextToken: ideas.nextToken
  }
}

export default loadIdeas
