# serverless-bologna-js

```
npm init
npm install --save-dev serverless
```

Create a link in the slides to do the kickstart

* create aws account
* clone the base repo
* create the IAM
* update the .aws config and credential
* install the aws cli
* run the command to check the credentials



Create a `serverless.json` file

```
{

}
```

```
npm run deploy
```

output

```
Serverless: Packaging service...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
.....
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Validating template...
Serverless: Updating Stack...
Service Information
service: todo-bologna-js
stage: dev
region: eu-west-1
stack: todo-bologna-js-dev
api keys:
  None
endpoints:
  None
functions:
  None
```

## Create and add the first lambda

***File src/lambda.js***

```javascript
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
```
***File serverless/functions.json***

```javascript
{
  "getlist": {
    "handler": "src/lambda.getList",
    "events": [
      {
        "http": {
          "path": "/todos",
          "method": "get",
          "cors": true
        }
      },
      {
        "http": {
          "path": "/todos/{proxy+}",
          "method": "get",
          "cors": true
        }
      }
    ]
  }
}
```

Deploy and test:

```bash
curl https://rk60de6k0a.execute-api.eu-west-1.amazonaws.com/dev/todos

curl --header "Content-Type: application/json"   --request POST   --data '{"username":"xyz","password":"xyz"}' https://rk60de6k0a.execute-api.eu-west-1.amazonaws.com/dev/todos?a=10
```

***output***

```
{"message":"Get List","body":null,"queryStringParameters":null}
```

## Add Dynamo db

```
{
  "TodoDynamoDbTable": {
    "Type": "AWS::DynamoDB::Table",
    "DeletionPolicy": "Delete",
    "Properties": {
      "AttributeDefinitions": [
        {
          "AttributeName": "UserIdentifier",
          "AttributeType": "S"
        }
      ],
      "KeySchema": [
        {
          "AttributeName": "UserIdentifier",
          "KeyType": "HASH"
        }
      ],
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1
      },
      "TableName": "${self:service}-${opt:stage, self:provider.stage}"
    }
  }
}
```

init the dynamodb table
```
AWS_PROFILE=profilename node utils/script.js
```

And update the lambda

```
'use strict'
const todoService = require('./todoService')

exports.getList = async (event, context, callback) => {
  if (!event.queryStringParameters || !event.queryStringParameters.name) {
    const response = {
      statusCode: 200,
      body: 'The name is required'
    }

    callback(null, response)
    return
  }

  const service = todoService('todo-bologna-js-dev', 'eu-west-1')
  const result = service.list(event.queryStringParameters.name)

  const response = {
    statusCode: 200,
    body: JSON.stringify(result.Items)
  }

  callback(null, response)
}

```

Try the endpoint and see that fails due the access limitation on dynamodb (check the log in cloudwatch)

### Add the policies

The `iamRoleStatemens` field in the `profile` define the policies statements for the lambda created.

```
 "iamRoleStatements": [
      {
        "Effect": "Allow",
        "Action": [
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ],
        "Resource":
          "arn:aws:dynamodb:*"
      }
    ]
```

**by default the logs statements are set, if for some reason you everride completely the role, remember to add `logs` statements, otherwise the lambda won't log on `cloudwatch`**

### Pass env value to the lambda function

The `environment ` field in the `profile` define the environment variables available in the lambda created.

```
"environment": {
  "DYNAMODB_TABLE": "${self:service}-${opt:stage, self:provider.stage}",
  "DYNAMODB_REGION": "${self:provider.region}"
},

```

```
exports.getList = async (event, context, callback) => {
  const dynamoDbTable = process.env.DYNAMODB_TABLE
  const dynamoDbRegion = process.env.DYNAMODB_REGION

...
```

### Strict the access roules
https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html



### Add serverless-stack-output
```
"custom": {
  "output": {
    "file": "config/stack.json"
  }
},
```





