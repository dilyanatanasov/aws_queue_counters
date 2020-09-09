import {Stack, Construct, StackProps, Duration} from '@aws-cdk/core';
import * as sqs from '@aws-cdk/aws-sqs';
import {PolicyStatement} from "@aws-cdk/aws-iam";
import * as lambda from "@aws-cdk/aws-lambda-nodejs";
import {SqsEventSource} from "@aws-cdk/aws-lambda-event-sources";
import {Table, AttributeType, BillingMode} from "@aws-cdk/aws-dynamodb";
import * as path from "path";

export class QueueStack extends Stack{
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.createSqsForCounters();
  }

  private createSqsForCounters(): void {
    new QueueResources(this, "queue-resources");
  }
}

class QueueResources extends Construct {
  constructor(scope: Construct, id: string, props?: StackProps){
    super(scope, id)
    const queue = new sqs.Queue(this, "sqs-import-log-counters", {
      queueName: "queue-import-log.fifo",
      fifo: true,
    });

    const table = new Table(this, "table-for-queues", {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "pk",
        type: AttributeType.STRING
      },
      tableName: "queque-counter"
    });

    const lambdaForResolver = new lambda.NodejsFunction(this, 'queueResolver', {
      entry: path.resolve(__dirname, "queue-resolver.ts"),
    });
    lambdaForResolver.addEventSource(new SqsEventSource(queue));
    lambdaForResolver.addToRolePolicy(new PolicyStatement({
      actions: [
        "dynamodb:*"
      ],
      resources: [
        "*"
      ]
    }));
    lambdaForResolver.addEnvironment("TABLE_NAME", table.tableName);

    const lambdaForRequestor = new lambda.NodejsFunction(this, 'queueRequestor', {
      entry: path.resolve(__dirname, "queue-requestor.ts"),
      timeout: Duration.seconds(15),
    });
    lambdaForRequestor.addToRolePolicy(new PolicyStatement({
      actions: [
        "sqs:*"
      ],
      resources: [
        "*"
      ]
    }));
  }
}
