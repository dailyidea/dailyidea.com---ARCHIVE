const { ScanPaginator } = require('@aws/dynamodb-query-iterator')
const AWS = require('aws-sdk')

module.exports = {
  /**
   * Logic for transforming into the new state
   */
  async up (dynamodb) {
    const paginator = new ScanPaginator(dynamodb, {
      TableName: `dailyidea-users-${process.env.STAGE}`,
      ReturnConsumedCapacity: 'INDEXES',
    })

    for await (const page of paginator) {
      for (const user of page.Items) {
        if (! user.email || user.ideaActivity !== void 0) continue
        console.log(`Migrating user ${user.email.S}`)
        await dynamodb.updateItem({
          TableName: `dailyidea-users-${process.env.STAGE}`,
          Key: { userId: user.userId },
          UpdateExpression: 'SET ideaActivity = :ideaActivity',
          ExpressionAttributeValues: {
            ':ideaActivity': { BOOL: true },
          },
        }).promise()
      }
    }
  },

  /**
   * Logic for reverting the changes if needed
   */
  async down (dynamodb) {
    //
  },
}

// module.exports.up(new AWS.DynamoDB({region: 'us-east-1'}))
