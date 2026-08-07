import { getRabbitClient, PublishOptions, RabbitMQClient } from "../rabbitmq";

export interface SmsPayload {
  recipient: string;
  message: string;
}

export interface EmailPayload {
  fromEmail?: string;
  fromName?: string;
  receipient: string;
  subject: string;
  topic?: string;
  [key: string]: unknown;
}

export interface InAppPayload {
  user: string;
  title: string;
  message: string;
  [key: string]: unknown;
}

export interface PushPayload {
  fcmToken: string;
  title: string;
  message: string;
  data?: Record<string, string>;
}

const NOTIFICATION_EXCHANGE = "notification";

const ROUTING_KEYS = {
  sms: "sms.notifications",
  email: "email.notifications",
  inApp: "inapp.notifications",
  push: "push.notifications",
} as const;

const BASE_PUBLISH_OPTIONS: Omit<PublishOptions, "routingKey"> = {
  exchange: NOTIFICATION_EXCHANGE,
  exchangeType: "topic",
  persistent: true,
};

export class NotificationPublisher {
  constructor(private readonly client: RabbitMQClient = getRabbitClient()) {}

  async sendSms(payload: SmsPayload): Promise<void> {
    await this.client.publish(payload, {
      ...BASE_PUBLISH_OPTIONS,
      routingKey: ROUTING_KEYS.sms,
    });
  }

  async sendEmail(payload: EmailPayload): Promise<void> {
    await this.client.publish(payload, {
      ...BASE_PUBLISH_OPTIONS,
      routingKey: ROUTING_KEYS.email,
    });
  }

  async sendInApp(payload: InAppPayload): Promise<void> {
    await this.client.publish(payload, {
      ...BASE_PUBLISH_OPTIONS,
      routingKey: ROUTING_KEYS.inApp,
    });
  }

  async sendPush(payload: PushPayload): Promise<void> {
    await this.client.publish(payload, {
      ...BASE_PUBLISH_OPTIONS,
      routingKey: ROUTING_KEYS.push,
    });
  }
}

export async function publishSmsNotification(payload: SmsPayload): Promise<void> {
  await new NotificationPublisher().sendSms(payload);
}
