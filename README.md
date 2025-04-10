# CDK issue 34100 POC

This repository aims to reproduce the bug filed at https://github.com/aws/aws-cdk/issues/34100

## Steps to reproduce
First, deploy the entire project.
It will create a S3 bucket, with 3 associated events:
* Lambda Mp3Handler will be invoked upon PUT of a mp3 file on bucket
* Lambda WebmHandler will be invoked upon PUT of a webm file on bucket
* An SNS event will be published upon deletion of a mp3 file

Then, start playing with event notifications in the lambda and storage stacks.

You should experiment the following:

Lambda-associated events only affect themselves (as expected). In detail:
- When deleting a lambda-associated event, the corresponding event will be deleted, leaving the rest untouched
- When re-adding a lambda-associated event, the corresponding event will be added, leaving the rest untouched

SNS-associated event overwrites the whole events set.
In detail:
- When deleting the SNS event, all events will be deleted, resulting in an event-less S3 bucket;
- When there are some pre-existing lambda events, adding a SNS event will overwrite everything, resulting in only the SNS event to be present on the bucket.
