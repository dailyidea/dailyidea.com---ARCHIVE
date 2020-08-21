module.exports = {
  /**
   * Logic for transforming into the new state
   */
  async up (dynamodb) {
    await dynamodb.updateItem({
      TableName: `dailyidea-users-${process.env.STAGE}`,
      Key: { userId: { S: 'd9248681-49cb-4327-9f61-2dcae645a834' } },
      UpdateExpression: "SET testField = :testField",
      ExpressionAttributeValues: {
        ':testField': { S: 'Some stuff' },
      },
    }).promise()
  },

  /**
   * Logic for reverting the changes if needed
   */
  async down (dynamodb) {
    await dynamodb.updateItem({
      TableName: `dailyidea-users-${process.env.STAGE}`,
      Key: { userId: { S: 'd9248681-49cb-4327-9f61-2dcae645a834' } },
      UpdateExpression: "SET testField = :testField",
      ExpressionAttributeValues: {
        ':testField': { S: 'Some stuff reverted' },
      },
    }).promise()
  }
}
