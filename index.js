var CfnLambda = require('cfn-lambda');
var AWS = require('aws-sdk');

var Item = require('./lib/item');

function DynamoDBItemHandler(event, context) {
  var DynamoDBItem = CfnLambda({
    Create: Item.Create,
    Update: Item.Update,
    Delete: Item.Delete,
    SchemaPath: [__dirname, 'src', 'schema.json']
  });
  // Not sure if there's a better way to do this...
  AWS.config.region = currentRegion(context);

  return DynamoDBItem(event, context);
}

function currentRegion(context) {
  return context.invokedFunctionArn.match(/^arn:aws:lambda:(\w+-\w+-\d+):/)[1];
}

exports.handler = DynamoDBItemHandler;
