import {
  institutionRepository,
  userRepository,
} from "@emacare/mongo/repository";

import { InstitutionType } from "@emacare/mongo/types/institution";
import { logger } from "@emacare/shared-utils";

import { hashedOtpOrPassword } from "../../utils/password-validator";
import { getAdditionalPermissions } from "../../utils/permission-util";
import { Realm, UserRole } from "@emacare/mongo/types/enum";

const SUPER_ADMIN_SWIFT = "SUPERADMIN";

export async function seedSuperAdmin() {
  try {
    // ── Super Admin Store / Platform Org ─────────────────────────────────────────
    let institutionId: any;

    const existing = await institutionRepository.findOne({
      swiftCode: SUPER_ADMIN_SWIFT,
    });

    if (!existing) {
      const institution = await institutionRepository.create({
        name: "EmaCare Global Marketplace Admin",
        institutionType: InstitutionType.DEFAULT,
        swiftCode: SUPER_ADMIN_SWIFT,
        phoneNumber: "+251900000000",
        email: "superadmin@ethiomarket.com",
        enabled: true,
        isDeleted: false,
      });

      institutionId = institution!._id;

      logger.info("Super admin platform organization seeded.");
    } else {
      institutionId = existing._id;

      logger.info("Super admin platform organization already exists.");
    }

    // ── Permissions ────────────────────────────────────────────────────────────
    const makerAdditionalPermissions = await getAdditionalPermissions(
      Realm.Institution,
      UserRole.Maker,
    );

    const checkerAdditionalPermissions = await getAdditionalPermissions(
      Realm.Institution,
      UserRole.Checker,
    );

    // ── Maker Admin User ────────────────────────────────────────────────────────
    const makerPhone = "+251900000001";

    const existingMaker = await userRepository.findOne({
      phoneNumber: makerPhone,
    });

    const makerPayload = {
      userCode: "USR-SUPER-MAKER",
      firstName: "Platform",
      middleName: "Admin",
      lastName: "Maker",
      phoneNumber: makerPhone,
      email: "admin.maker@ethiomarket.com",
      password: await hashedOtpOrPassword("password123"),
      role: UserRole.Maker,
      realm: Realm.Institution,
      organization: institutionId,
      isSetPassword: true,
      enabled: true,
      isDeleted: false,
      additionalPermissions: makerAdditionalPermissions,
    };

    if (!existingMaker) {
      await userRepository.create(makerPayload);

      logger.info("Platform admin maker user seeded successfully.");
    } else {
      await userRepository.updateOne({ _id: existingMaker._id }, makerPayload);

      logger.info("Platform admin maker user updated successfully.");
    }

    // ── Checker Admin User ──────────────────────────────────────────────────────
    const checkerPhone = "+251900000002";

    const existingChecker = await userRepository.findOne({
      phoneNumber: checkerPhone,
    });

    const checkerPayload = {
      userCode: "USR-SUPER-CHECKER",
      firstName: "Platform",
      middleName: "Admin",
      lastName: "Checker",
      phoneNumber: checkerPhone,
      email: "admin.checker@ethiomarket.com",
      password: await hashedOtpOrPassword("password123"),
      role: UserRole.Checker,
      realm: Realm.Institution,
      organization: institutionId,
      isSetPassword: true,
      enabled: true,
      isDeleted: false,
      additionalPermissions: checkerAdditionalPermissions,
    };

    if (!existingChecker) {
      await userRepository.create(checkerPayload);

      logger.info("Platform admin checker user seeded successfully.");
    } else {
      await userRepository.updateOne({ _id: existingChecker._id }, checkerPayload);

      logger.info("Platform admin checker user updated successfully.");
    }
  } catch (error) {
    logger.error("Error seeding super admin:", error);
  }
}
