import * as AWS from "aws-sdk";

export const handler = () => {
    let sqs = new AWS.SQS({apiVersion: '2012-11-05'});

    for (let i = 0; i < 100; i++) {
        let boolean = (i % 2 === 0)
        let data = {
            status: boolean,
            id: "ABC",
            count: i
        };
        let params = {
            MessageBody: JSON.stringify(data),
            MessageDeduplicationId: "Queue-" + JSON.stringify(Math.random()),  // Required for FIFO queues,
            MessageGroupId: "Group1",  // Required for FIFO queues
            QueueUrl: "https://sqs.eu-west-1.amazonaws.com/ACCOUNT_ID/queue-import-log.fifo"
        };
        sqs.sendMessage(params, function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data.MessageId);
            }
        });
    }
}