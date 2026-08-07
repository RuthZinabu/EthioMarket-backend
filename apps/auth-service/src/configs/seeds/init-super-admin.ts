import {
  institutionRepository,
  userRepository,
  permissionRepository,
} from "@emacare/mongo/repository";

import { InstitutionType } from "@emacare/mongo/types/institution";
import { PermissionAction } from "@emacare/mongo/types";
import { UserRole, Realm } from "@emacare/mongo/types/user";

import { logger } from "@emacare/shared-utils";

import { hashedOtpOrPassword } from "../../utils/password-validator";
import { getAdditionalPermissions } from "../../utils/permission-util";

const SUPER_ADMIN_SWIFT = "SUPERADMIN";

export async function seedSuperAdmin() {
  try {
    // ── Institution ────────────────────────────────────────────────────────────
    let institutionId: any;

    const existing = await institutionRepository.findOne({
      swiftCode: SUPER_ADMIN_SWIFT,
    });

    if (!existing) {
      const institution = await institutionRepository.create({
        name: "Super Admin Network",
        institutionType: InstitutionType.DEFAULT,
        swiftCode: SUPER_ADMIN_SWIFT,
        phoneNumber: "+251900000000",
        email: "superadmin@allbanknetwork.com",
        enabled: true,
        isDeleted: false,
      });

      institutionId = institution!._id;

      logger.info("Super admin institution seeded.");
    } else {
      institutionId = existing._id;

      logger.info("Super admin institution already exists.");
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

    // ── Maker ──────────────────────────────────────────────────────────────────
    const makerPhone = "+251900000001";

    const existingMaker = await userRepository.findOne({
      phoneNumber: makerPhone,
    });

    const makerPayload = {
      userCode: "USR-SUPER-MAKER",
      firstName: "Super",
      middleName: "Admin",
      lastName: "Maker",
      phoneNumber: makerPhone,
      email: "superadmin.maker@allbanknetwork.com",
      password: await hashedOtpOrPassword("password123"),
      ussdPin: await hashedOtpOrPassword("1234"),
      ussdEnabled: true,
      role: UserRole.Maker,
      realm: Realm.Institution,
      organization: institutionId,
      organizationEnum: Realm.Institution,
      isSetPassword: true,
      enabled: true,
      isDeleted: false,
      additionalPermissions: makerAdditionalPermissions,
    };

    if (!existingMaker) {
      await userRepository.create(makerPayload);

      logger.info("Super admin maker user seeded.");
    } else {
      await userRepository.updateOne({ _id: existingMaker._id }, makerPayload);

      logger.info("Super admin maker user updated.");
    }

    // ── Checker ────────────────────────────────────────────────────────────────
    const checkerPhone = "+251900000002";

    const existingChecker = await userRepository.findOne({
      phoneNumber: checkerPhone,
    });

    const checkerPayload = {
      userCode: "USR-SUPER-CHECKER",
      firstName: "Super",
      middleName: "Admin",
      lastName: "Checker",
      phoneNumber: checkerPhone,
      email: "superadmin.checker@allbanknetwork.com",
      password: await hashedOtpOrPassword("password123"),
      ussdPin: await hashedOtpOrPassword("1234"),
      ussdEnabled: true,
      role: UserRole.Checker,
      realm: Realm.Institution,
      organization: institutionId,
      organizationEnum: Realm.Institution,
      isSetPassword: true,
      enabled: true,
      isDeleted: false,
      additionalPermissions: checkerAdditionalPermissions,
    };

    if (!existingChecker) {
      await userRepository.create(checkerPayload);

      logger.info("Super admin checker user seeded.");
    } else {
      await userRepository.updateOne({ _id: existingChecker._id }, checkerPayload);

      logger.info("Super admin checker user updated.");
    }
  } catch (error) {
    logger.error("Error seeding super admin:", error);
  }
}
