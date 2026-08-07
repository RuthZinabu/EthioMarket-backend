import { logger } from "@emacare/shared-utils";
import { seedSuperAdmin } from "./init-super-admin";
import { seedInstitution } from "./init-institution";

export async function runSeed() {
  try {
    logger.info("Starting seed process...");

    await seedSuperAdmin();
    await seedInstitution();

    logger.info("All seeds completed successfully.");
  } catch (error) {
    logger.error("Seed process failed:", error);
    throw error;
  }
}
