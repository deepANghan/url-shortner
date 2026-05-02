import ampq, { type Channel, type ChannelModel, type Connection } from "amqplib";

export const MQ_CONFIG = {
    url: process.env.RABBITMQ_URL!,
    exchange: 'app_events',
    exchangeType: 'direct',
    queues: {
        analytics: 'analytics'
    }
};

let connection: Connection | null = null;
let channel: Channel | null = null;

export async function connectToMSGQueue(): Promise<{ connection: Connection; channel: Channel }> {

    if (!connection || !channel) {

        let chanMode = await ampq.connect(MQ_CONFIG.url);

        connection = chanMode.connection;
        channel = await chanMode.createChannel();
    }

    // Ensure the exchange exists globally
    await channel.assertExchange(MQ_CONFIG.exchange, MQ_CONFIG.exchangeType, { durable: true });

    await channel.assertQueue(MQ_CONFIG.queues.analytics);
    await channel.bindQueue(MQ_CONFIG.queues.analytics, MQ_CONFIG.exchange, 'url.click');

    return { connection: connection, channel };
}