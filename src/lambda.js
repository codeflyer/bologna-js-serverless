'use strict'
const todoService = require('./todoService')

const dynamoDbTable = process.env.DYNAMODB_TABLE
const dynamoDbRegion = process.env.DYNAMODB_REGION

exports.getList = async (event, context, callback) => {
  if (!event.queryStringParameters || !event.queryStringParameters.name) {
    const response = {
      statusCode: 200,
      body: 'The name is required'
    }

    callback(null, response)
    return
  }

  const service = todoService(dynamoDbTable, dynamoDbRegion)
  const result = await service.list(event.queryStringParameters.name)

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      items: result.Items,
      context: { dynamoDbTable, dynamoDbRegion }
    })
  }

  callback(null, response)
}
