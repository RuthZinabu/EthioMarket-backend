import { EventEmitter } from "events";
import { logger } from "./utils/logger";

export interface PublishOptions {
  exchange?: string;
  exchangeType?: string;
  persistent?: boolean;
  routingKey?: string;
}

export class RabbitMQClient extends EventEmitter {
  private isConnected: boolean = false;

  constructor(private readonly amqpUrl?: string) {
    super();
  }

  async connect(): Promise<void> {
    if (this.amqpUrl) {
      try {
        logger.info(`Connecting to RabbitMQ at ${this.amqpUrl}...`);
        this.isConnected = true;
      } catch (error) {
        logger.warn("RabbitMQ connection failed, using event emitter fallback.", error);
        this.isConnected = false;
      }
    } else {
      logger.info("RabbitMQ URL not configured. Operating in local Event Mode.");
    }
  }

  async publish(payload: any, options: PublishOptions = {}): Promise<void> {
    const routingKey = options.routingKey || "default";
    logger.info(`[Event Bus] Publishing message to topic '${routingKey}':`, payload);
    this.emit(routingKey, payload);
    this.emit("*", { routingKey, payload });
  }

  async subscribe(routingKey: string, handler: (payload: any) => Promise<void> | void): Promise<void> {
    this.on(routingKey, async (data) => {
      try {
        await handler(data);
      } catch (err) {
        logger.error(`Error handling event on '${routingKey}':`, err);
      }
    });
  }
}

let defaultRabbitClient: RabbitMQClient | null = null;

export function getRabbitClient(): RabbitMQClient {
  if (!defaultRabbitClient) {
    const amqpUrl = process.env.RABBITMQ_URL;
    defaultRabbitClient = new RabbitMQClient(amqpUrl);
  }
  return defaultRabbitClient;
}
