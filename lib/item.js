var AWS = require('aws-sdk');
var uuid = require('uuid');

var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var docClient = new AWS.DynamoDB.DocumentClient();

var getKeys = function(tableName, callback) {
  dynamodb.describeTable({ TableName: tableName }, function(err, data) {
    if (err) return callback(err);
    var keys = data.Table.KeySchema.map(function(key) { return key.AttributeName; });
    callback(null, keys);
  });
}
var generatePhysicalId = function(tableName, keys) {
  return tableName + "-" + keys.join('-');
}

var Create = function(params, reply) {
  getKeys(params.TableName, function(err, keys) {
    if (err) {
      console.error(err);
      return reply(err);
    }
    docClient.put(params, function(err, data) {
      if (err) {
        console.error(err);
        reply(err);
      } else  {
        reply(null, generatePhysicalId(params.TableName, keys));
      }
    });
  });
};

var Update = function(physicalId, params, oldParams, reply) {
  Delete(physicalId, oldParams, function(err) {
    if (err) return reply(err);
    Create(params, reply);
  });
};

var Delete = function(physicalId, params, reply) {
  var tableName = params.TableName;
  getKeys(tableName, function(err, keys) {
    if (err) {
      console.log(err);
      return reply(err);
    }
    var p = {
      TableName: tableName,
      Key: {}
    };
    keys.forEach( function(key) {
      p.Key[key] = params.Item[key];
    });
    console.log(p);
    docClient.delete(p, function(err, data) {
      if (err) console.error(err)
      reply(err, physicalId);
    });
  });
};

exports.Create = Create;
exports.Update = Update;
exports.Delete = Delete;
