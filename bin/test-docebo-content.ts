#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TestDoceboContentStack } from '../lib/test-docebo-content-stack';

const app = new cdk.App();
new TestDoceboContentStack(app, 'TestDoceboContentStack');
