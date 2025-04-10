import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';

export class Mp3LambdaStack extends cdk.Stack {
  public readonly handler: lambda.Function;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function
    this.handler = new lambda.Function(this, 'Mp3Handler', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('Processing MP3 file:', JSON.stringify(event));
          return {
            statusCode: 200,
            body: 'Hello from MP3 handler!'
          };
        };
      `),
    });

    // Import the bucket using cross-stack reference
    const bucketArn = cdk.Fn.importValue('MediaBucketArn');
    const bucketName = cdk.Fn.importValue('MediaBucketName');
    
    const bucket = s3.Bucket.fromBucketAttributes(this, 'ImportedBucket', {
      bucketArn: bucketArn,
      bucketName: bucketName,
    });

    // Grant permissions to the Lambda function
    bucket.grantRead(this.handler);

    // Add S3 notifications for MP3 files
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED_PUT,
      new s3n.LambdaDestination(this.handler),
      { suffix: '.mp3' }
    );
  }
} 