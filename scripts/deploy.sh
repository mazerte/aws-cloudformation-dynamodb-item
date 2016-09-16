#!/bin/bash

node_modules/.bin/cfn-lambda zip --output deploy/archive.zip

echo "Deploy $TRAVIS_TAG version to S3"
aws s3 cp deploy/archive.zip s3://chatanoo-deployment/aws-cloudformation-dynamodb-item/$TRAVIS_TAG.zip

echo "Upload latest"
aws s3api put-object \
  --bucket chatanoo-deployment \
  --key aws-cloudformation-dynamodb-item/latest.zip \
  --website-redirect-location /chatanoo-deployment/aws-cloudformation-dynamodb-item/$TRAVIS_TAG.zip
