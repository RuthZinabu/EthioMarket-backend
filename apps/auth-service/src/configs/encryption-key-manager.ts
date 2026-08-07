import { logger } from "@emacare/shared-utils";
import { RedisClient, RedisValuePairKeys } from "@emacare/shared-utils";
import tweetnacl from "tweetnacl";
import twitUtil from "tweetnacl-util";

export async function generateAndSavePublicKey(): Promise<void> {
  try {
    const keyPair = tweetnacl.box.keyPair();
    const privateKey = twitUtil.encodeBase64(keyPair.secretKey);
    const publicKey = twitUtil.encodeBase64(keyPair.publicKey);
    const client = await RedisClient.getClient();
    await client.set(RedisValuePairKeys.SERVER_PRIVATE_KEY, privateKey);
    await client.set(RedisValuePairKeys.SERVER_PUBLIC_KEY, publicKey);
    logger.info("keys saved to redis");
  } catch (error) {
    logger.log("error to save public key to redis", error);
  }
}
