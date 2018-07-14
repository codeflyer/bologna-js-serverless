'use strict'
const AWS = require('aws-sdk')

exports.getList = async (event, context, callback) => {
  if (!event.queryStringParameters.name) {
    const response = {
      statusCode: 200,
      body: 'The name is required'
    }

    callback(null, response)
    return
  }
  const dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    region: 'eu-west-1'
  })
  const documentClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb })

  const params = {
    TableName: 'todo-bologna-js-dev',
    KeyConditions: {
      UserIdentifier: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [event.queryStringParameters.name]
      }
    }
  }

  const result = await documentClient.query(params).promise()

  const response = {
    statusCode: 200,
    body: JSON.stringify(result.Items)
  }

  callback(null, response)
}
