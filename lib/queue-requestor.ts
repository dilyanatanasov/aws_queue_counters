import * as AWS from "aws-sdk";

export const handler = () => {
    let sqs = new AWS.SQS({apiVersion: '2012-11-05'});

    for (let i = 0; i < 100; i++) {
        let boolean = (i % 2 === 0)// (Math.random() > 0.5);
        let data = {
            status: boolean,
            id: "ABC",
            count: i
        };
        let params = {
        //     // Remove DelaySeconds parameter and value for FIFO queues
        //     DelaySeconds: 10,
            MessageBody: JSON.stringify(data),
            MessageDeduplicationId: "TheWhistler" + JSON.stringify(Math.random()),  // Required for FIFO queues,
            MessageGroupId: "Group1",  // Required for FIFO queues
            QueueUrl: "https://sqs.eu-west-1.amazonaws.com/744985246001/queue-import-log.fifo"
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