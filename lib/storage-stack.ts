import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SnsDestination } from 'aws-cdk-lib/aws-s3-notifications';
import * as sns from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

export class StorageStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;
  public readonly topic: sns.Topic;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket
    this.bucket = new s3.Bucket(this, 'MediaBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create an SNS topic
    this.topic = new sns.Topic(this, 'DeleteNotificationTopic', {
      displayName: 'S3 Delete Notification Topic',
    });
    this.bucket.addEventNotification(
      s3.EventType.OBJECT_REMOVED_DELETE,
      new SnsDestination(this.topic),
      {suffix: ".mp3"}
  );

    // Export the bucket name and ARN
    new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
      exportName: 'MediaBucketName'
    });

    new cdk.CfnOutput(this, 'BucketArn', {
      value: this.bucket.bucketArn,
      exportName: 'MediaBucketArn'
    });
  }
} 