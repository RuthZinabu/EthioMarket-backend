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

export async function seedInstitution() {
  try {
    const existingInstitution = await institutionRepository.findOne({
      swiftCode: "ABNETEAA",
    });

    let institutionId: any;

    if (!existingInstitution) {
      const newInstitution = await institutionRepository.create({
        name: "All Bank Network",
        institutionType: InstitutionType.VENDER,
        swiftCode: "ABNETEAA",
        phoneNumber: "+251911111111",
        email: "info@allbanknetwork.com",
        etSwitchCode: "000",
        enabled: true,
        isDeleted: false,
      });

      institutionId = newInstitution?._id;

      logger.info("Default institution (Dashen Bank) seeded successfully.");
    } else {
      institutionId = existingInstitution._id;

      logger.info("Default institution already exists.");
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

    // ── Seed Maker User ────────────────────────────────────────────────────────
    const makerPhone = "+251911111101";

    const existingMaker = await userRepository.findOne({
      phoneNumber: makerPhone,
      realm: Realm.Institution,
    });

    const makerPayload = {
      userCode: "USR-MAKER",
      firstName: "All",
      middleName: "Bank",
      lastName: "Maker",
      phoneNumber: makerPhone,
      email: "maker@allbanknetwork.com",
      ussdPin: await hashedOtpOrPassword("1234"),
      ussdEnabled: true,
      role: UserRole.Maker,
      realm: Realm.Institution,
      organization: institutionId,
      organizationEnum: Realm.Institution,
      enabled: true,
      isDeleted: false,
      isSetPassword: true,
      password: await hashedOtpOrPassword("password123"),

      additionalPermissions: makerAdditionalPermissions,
    };

    if (!existingMaker) {
      await userRepository.create(makerPayload);

      logger.info("Dashen Maker user seeded successfully.");
    } else {
      await userRepository.updateOne({ _id: existingMaker._id }, makerPayload);

      logger.info("Dashen Maker user updated successfully.");
    }

    // ── Seed Checker User ──────────────────────────────────────────────────────
    const checkerPhone = "+251911111102";

    const existingChecker = await userRepository.findOne({
      phoneNumber: checkerPhone,
      realm: Realm.Institution,
    });

    const checkerPayload = {
      userCode: "USR-CHECKER",
      firstName: "All",
      middleName: "Bank",
      lastName: "Checker",
      phoneNumber: checkerPhone,
      email: "checker@allbanknetwork.com",
      ussdPin: await hashedOtpOrPassword("1234"),
      ussdEnabled: true,
      role: UserRole.Checker,
      realm: Realm.Institution,
      organization: institutionId,
      organizationEnum: Realm.Institution,
      enabled: true,
      isDeleted: false,
      isSetPassword: true,
      password: await hashedOtpOrPassword("password123"),

      additionalPermissions: checkerAdditionalPermissions,
    };

    if (!existingChecker) {
      await userRepository.create(checkerPayload);

      logger.info("Dashen Checker user seeded successfully.");
    } else {
      await userRepository.updateOne({ _id: existingChecker._id }, checkerPayload);

      logger.info("Dashen Checker user updated successfully.");
    }
  } catch (error) {
    logger.error("Error seeding institution and users:", error);
  }
}
