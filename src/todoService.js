const AWS = require('aws-sdk')
const uuidv1 = require('uuid/v1')

function todoService(tableName, region) {
  async function list(user) {
    const dynamodb = new AWS.DynamoDB({
      apiVersion: '2012-08-10',
      region: region
    })

    const documentClient = new AWS.DynamoDB.DocumentClient({
      service: dynamodb
    })

    const params = {
      TableName: tableName,
      ScanIndexForward: true,
      KeyConditions: {
        UserIdentifier: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [user]
        }
      }
    }

    return documentClient.query(params).promise()
  }

  async function getByUUID(uuid) {
    const dynamodb = new AWS.DynamoDB({
      apiVersion: '2012-08-10',
      region: region
    })

    const documentClient = new AWS.DynamoDB.DocumentClient({
      service: dynamoDb
    })
    const params = {
      TableName: tableName,
      IndexName: 'UUIDIndex',
      Limit: 1,
      ExpressionAttributeValues: {
        ':v1': id
      },
      KeyConditionExpression: 'Id = :v1'
    }
    const result = await documentClient.query(params).promise()

    if (!result.Count) {
      throw new Error(`Cannot find element with id ${id}`)
    }
    return result.Items[0]
  }

  async function add(user, todo) {
    const dynamodb = new AWS.DynamoDB({
      apiVersion: '2012-08-10',
      region: region
    })

    const documentClient = new AWS.DynamoDB.DocumentClient({
      service: dynamoDb
    })

    const params = {
      Item: {
        UserIdentifier: user,
        Id: uuidv1(),
        ToDo: todo
      },
      ReturnConsumedCapacity: 'TOTAL',
      TableName: tableName
    }

    await documentClient.put(params).promise()
    return params
  }

  return {
    list,
    getByUUID,
    add
  }
}

module.exports = todoService
