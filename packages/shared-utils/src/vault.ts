import vault from "node-vault";
import { logger } from "./utils/logger";

export class VaultService {
  private vaultInstance;

  constructor(config: { apiVersion: string; endpoint: string; token: string }) {
    this.vaultInstance = vault({
      apiVersion: config.apiVersion,
      endpoint: config.endpoint,
      token: config.token,
      requestOptions: { timeout: 3000 }, // 3s timeout for faster failure in dev
    });
  }

  public async getSecret(path: string) {
    try {
      const secret = await this.vaultInstance.read(path);
      return secret.data.data;
    } catch (err) {
      logger.error("Error reading secret from Vault:", err);
      console.error("Error reading secret from Vault:", err);
      throw err;
    }
  }
  public async setSecret(path: string, secret: { [key: string]: string }) {
    try {
      const currentSecret = await this.vaultInstance.read(path);
      const existingData = currentSecret ? currentSecret.data.data : {};
      const updatedData = { ...existingData, ...secret };
      const _data = await this.vaultInstance.write(path, {
        data: updatedData,
      });
      return _data;
    } catch (err) {
      logger.error("Error writing secret to Vault:", err);
      console.error("Error writing secret to Vault:", err);
      throw err;
    }
  }
}
