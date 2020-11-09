const ORDER = {
  DATE_ASC: 'DATE_ASC',
  DATE_DESC: 'DATE_DESC',
  TITLE_ASC: 'TITLE_ASC',
  TITLE_DESC: 'TITLE_DESC',
  COMMENTS: 'COMMENTS',
  LIKES: 'LIKES'
}

const orderOptions = [
  { title: 'Sort by Newest', code: ORDER.DATE_DESC },
  { title: 'Sort by Oldest', code: ORDER.DATE_ASC },
  { title: 'Most Popular', code: ORDER.LIKES },
  { title: 'Most Commented', code: ORDER.COMMENTS },
  { title: 'Alphabetically Up', code: ORDER.TITLE_ASC },
  { title: 'Alphabetically Down', code: ORDER.TITLE_DESC }
]

export { ORDER, orderOptions }
