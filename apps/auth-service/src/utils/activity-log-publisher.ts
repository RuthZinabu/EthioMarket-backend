import { type IUserActivityLog } from "@emacare/shared-utils";
import { logger } from "@emacare/shared-utils";

export async function publishActivityLog(log: IUserActivityLog): Promise<void> {
  // try {
  //   const rabbitClient = getRabbitClient();
  //   const exchange = process.env.RABBIT_MQ_LOG_EXCHANGE || "system-log";
  //   const routingKey = "system-log";
  //   await rabbitClient.publish(log, {
  //     exchange,
  //     routingKey,
  //     exchangeType: "topic",
  //   });
  // } catch (error) {
  //   logger.error("[ActivityLog] Failed to publish activity log to RabbitMQ:", error as Error);
  // }
}
