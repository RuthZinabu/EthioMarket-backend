import { BadRequestException, errorDefinitions } from "@emacare/shared-utils";
import { userRepository } from "@emacare/mongo/repository";
import { RedisClient } from "@emacare/shared-utils";
import moment from "moment";

const LOCK_TABLE: Record<number, number> = { 3: 15, 4: 60 };

export async function registerMerchantIdMismatch(phone: string): Promise<void> {
  const redis = await RedisClient.getClient();
  const raw = JSON.parse((await redis.get(phone)) ?? "{}") as {
    count?: number;
    lastTry?: string;
  };

  const prev = raw.count ?? 0;
  const now = moment();

  const lockDur = LOCK_TABLE[prev] ?? 0;
  if (lockDur && raw.lastTry && now.diff(moment(raw.lastTry), "minutes") < lockDur) {
    throw new BadRequestException(
      errorDefinitions.AUTH_MS.AUTH_TOO_MANY_ATTEMPTS(
        lockDur - now.diff(moment(raw.lastTry), "minutes"),
      ),
    );
  }

  const next = prev + 1;

  if (next >= 5) {
    await userRepository.updateMany({ phoneNumber: phone, isDeleted: false }, { enabled: false });
    await redis.del(phone);
    throw new BadRequestException(errorDefinitions.AUTH_MS.AUTH_USER_DISABLED);
  }

  await redis.set(phone, JSON.stringify({ count: next, lastTry: now.toISOString() }));

  if (next === 3 || next === 4) {
    throw new BadRequestException(
      errorDefinitions.AUTH_MS.AUTH_TOO_MANY_ATTEMPTS(LOCK_TABLE[next]),
    );
  }
}
