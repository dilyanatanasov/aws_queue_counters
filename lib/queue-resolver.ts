import {DynamoDB} from "aws-sdk";

export const handler = async (event: any) => {
    const db = new DynamoDB();
    for (let record of event.Records) {
        let dataObject: any = JSON.parse(record.body);
        let upload: any = {};
        let update: any = {};

        try {
            const oldRecord = await db.getItem({
                TableName: process.env.TABLE_NAME as string,
                Key: {
                    "pk": {
                        S: dataObject.id
                    }
                }
            }).promise();

            if (!oldRecord.Item) {
                upload = {
                    pk: dataObject.id,
                    id: dataObject.id,
                    success: (dataObject.status) ? 1 : 0,
                    dido: (dataObject.status) ? 0 : 1
                }

                await db.putItem({
                    TableName: process.env.TABLE_NAME as string,
                    Item: DynamoDB.Converter.marshall(upload)
                }).promise();
            } else {
                const inc = 1;
                const inc2 = 0;
                update = await db.updateItem({
                    TableName: process.env.TABLE_NAME as string,
                    Key: {pk: {"S": dataObject.id}},
                    UpdateExpression: (dataObject.status) ? "ADD success :inc, " : "ADD error :inc",
                    ExpressionAttributeNames: {
                        "#succes": "succes",
                        "#error": "error",
                    },
                    ExpressionAttributeValues:{
                        ":inc": {
                            N: inc.toString()
                        },
                        ":dont_inc": {
                            N: inc2.toString()
                        }
                    },
                    ReturnValues: "ALL_NEW"
                }).promise();
            }
        } catch (e) {
            throw new Error(e);
        }
    }
};