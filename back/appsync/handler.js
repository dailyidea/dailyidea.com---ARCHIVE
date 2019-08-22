exports.graphqlHandler = (event, context, callback) => {
  console.log('Received event {}', JSON.stringify(event, 3))


  console.log('Got an Invoke Request.')
  switch (event.field) {
    case 'updateIdea': {

      break
    }
    case 'deleteIdea': {


      break
    }
    case 'createIdea': {

      break
    }
    default: {
      callback(`Unknown field, unable to resolve ${event.field}`, null)
      break
    }
  }
}
