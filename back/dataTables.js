const {
  attribute,
  hashKey,
  rangeKey,
  table
} = require('@aws/dynamodb-data-mapper-annotations')

@table('IdeasTable')
class IdeaDB {
    @hashKey()
    id: string;

    @rangeKey({defaultProvider: () => new Date()})
    createdAt: Date;

    @attribute()
    completed?: boolean;
}
