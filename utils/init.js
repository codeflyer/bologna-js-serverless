const AWS = require('aws-sdk')
const uuidv1 = require('uuid/v1')
const config = require('../config/deployValues')
const tableName = 'todo-bologna-js-dev'
const dynamoDb = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  region: config.region
})

const add = async ({ todo, userIdentifier }) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({
    service: dynamoDb
  })

  const params = {
    Item: {
      UserIdentifier: userIdentifier,
      Id: uuidv1(),
      ToDo: todo
    },
    ReturnConsumedCapacity: 'TOTAL',
    TableName: tableName
  }

  console.log('Add: ', userIdentifier, ' - ', todo)
  await documentClient.put(params).promise()
}

async function resetDb() {
  const result = await dynamoDb.scan({ TableName: tableName }).promise()
  for (let Item of result.Items) {
    let params = {
      Key: {
        UserIdentifier: Item.UserIdentifier,
        Id: Item.Id
      },
      TableName: tableName
    }
    await dynamoDb.deleteItem(params).promise()
  }

  console.log('Add todos')
  await add({userIdentifier: 'user1', todo: 'Do something 1'})
  await add({userIdentifier: 'user2', todo: 'Do something 2'})
  await add({userIdentifier: 'user1', todo: 'Do something 3'})
  await add({userIdentifier: 'user1', todo: 'Do something 4'})
}

resetDb()
