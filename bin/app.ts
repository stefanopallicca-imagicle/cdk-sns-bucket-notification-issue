#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StorageStack } from '../lib/storage-stack';
import { Mp3LambdaStack } from '../lib/mp3-lambda-stack';
import { WebmLambdaStack } from '../lib/webm-lambda-stack';

const app = new cdk.App();

// Create the storage stack first since other stacks depend on it
const storageStack = new StorageStack(app, 'StorageStack', {
});

// Create the MP3 Lambda stack
const mp3Stack = new Mp3LambdaStack(app, 'Mp3LambdaStack', {
});

// Create the WebM Lambda stack
const webmStack = new WebmLambdaStack(app, 'WebmLambdaStack', {
});

// Add dependencies to ensure proper deployment order
mp3Stack.addDependency(storageStack);
webmStack.addDependency(storageStack); 