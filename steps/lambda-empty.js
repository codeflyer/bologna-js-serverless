'use strict'

exports.getList = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Get List',
      body: event.body,
      queryStringParameters: event.queryStringParameters,
    })
  }

  callback(null, response)
}

exports.addTodo = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Add todo',
      body: event.body,
      queryStringParameters: event.queryStringParameters,
    })
  }

  callback(null, response)
}

exports.setStatus = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Set status',
      body: event.body,
      queryStringParameters: event.queryStringParameters,
    })
  }

  callback(null, response)
}

