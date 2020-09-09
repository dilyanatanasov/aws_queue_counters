#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { QueueStack } from '../lib/test-docebo-content-stack';

const app = new cdk.App();
new QueueStack(app, 'Queue-Stack', {
    env: {
        account: "ACCOUNT_CODE",
        region: "REGION"
    }
});
