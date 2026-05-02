import type { ConsumeMessage } from "amqplib";
import { connectToMSGQueue, MQ_CONFIG } from "./config/msgQueueClient.js";
import { dbClient } from "@package/db";
import { trackUrlClick } from "./jobs/analytics.js";

async function main() {

    const { channel } = await connectToMSGQueue();

    channel.consume(MQ_CONFIG.queues.analytics, async (msg: ConsumeMessage | null) => {

        if (msg) {

            try {

                let data = msg.content.toString();

                console.log("URL ID", data);

                await trackUrlClick(Number.parseInt(data));

                channel.ack(msg);

            } catch (error) {

                console.log(error);

                channel.nack(msg);
            }
        }

    });
}

main();
console.log("Worker started");