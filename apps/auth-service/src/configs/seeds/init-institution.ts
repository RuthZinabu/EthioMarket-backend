import {
  institutionRepository,
  userRepository,
  vendorRepository,
} from "@emacare/mongo/repository";

import { InstitutionType } from "@emacare/mongo/types/institution";
import { VendorStatus, PayoutMethod } from "@emacare/mongo/types/vendor";
import { logger } from "@emacare/shared-utils";

import { hashedOtpOrPassword } from "../../utils/password-validator";
import { getAdditionalPermissions } from "../../utils/permission-util";
import { Realm, UserRole } from "@emacare/mongo/types/enum";

export async function seedInstitution() {
  try {
    const existingInstitution = await institutionRepository.findOne({
      swiftCode: "ETHIOMKT",
    });

    let institutionId: any;

    if (!existingInstitution) {
      const newInstitution = await institutionRepository.create({
        name: "Ethio Global Market Vendor Org",
        institutionType: InstitutionType.VENDER,
        swiftCode: "ETHIOMKT",
        phoneNumber: "+251911111111",
        email: "vendor@ethiomarket.com",
        enabled: true,
        isDeleted: false,
      });

      institutionId = newInstitution?._id;

      logger.info("Default Vendor Organization seeded successfully.");
    } else {
      institutionId = existingInstitution._id;

      logger.info("Default Vendor Organization already exists.");
    }

    // ── Seed Vendor Store Model ───────────────────────────────────────────────
    const existingVendor = await vendorRepository.findOne({
      slug: "ethio-global-market",
    });

    if (!existingVendor) {
      await vendorRepository.create({
        storeName: "Ethio Global Market Store",
        slug: "ethio-global-market",
        description: "Official international store for Ethiopian products & crafts",
        contactEmail: "vendor.store@ethiomarket.com",
        contactPhone: "+251911111111",
        country: "ET",
        status: VendorStatus.APPROVED,
        isVerified: true,
        commissionRate: 0.10,
        payoutMethod: PayoutMethod.BANK_TRANSFER,
        payoutBankDetails: {
          accountName: "Ethio Global Market PLC",
          accountNumber: "1000123456789",
          bankName: "Commercial Bank of Ethiopia",
          swiftOrRoutingCode: "CBETETAA",
          currency: "USD",
        },
        enabled: true,
        isDeleted: false,
      });

      logger.info("Default Vendor Store seeded successfully.");
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

    // ── Seed Maker Vendor User ──────────────────────────────────────────────────
    const makerPhone = "+251911111101";

    const existingMaker = await userRepository.findOne({
      phoneNumber: makerPhone,
      realm: Realm.Institution,
    });

    const makerPayload = {
      userCode: "USR-VENDOR-MAKER",
      firstName: "Vendor",
      middleName: "Store",
      lastName: "Maker",
      phoneNumber: makerPhone,
      email: "vendor.maker@ethiomarket.com",
      role: UserRole.Maker,
      realm: Realm.Institution,
      organization: institutionId,
      enabled: true,
      isDeleted: false,
      isSetPassword: true,
      password: await hashedOtpOrPassword("password123"),
      additionalPermissions: makerAdditionalPermissions,
    };

    if (!existingMaker) {
      await userRepository.create(makerPayload);

      logger.info("Vendor Maker user seeded successfully.");
    } else {
      await userRepository.updateOne({ _id: existingMaker._id }, makerPayload);

      logger.info("Vendor Maker user updated successfully.");
    }

    // ── Seed Checker Vendor User ────────────────────────────────────────────────
    const checkerPhone = "+251911111102";

    const existingChecker = await userRepository.findOne({
      phoneNumber: checkerPhone,
      realm: Realm.Institution,
    });

    const checkerPayload = {
      userCode: "USR-VENDOR-CHECKER",
      firstName: "Vendor",
      middleName: "Store",
      lastName: "Checker",
      phoneNumber: checkerPhone,
      email: "vendor.checker@ethiomarket.com",
      role: UserRole.Checker,
      realm: Realm.Institution,
      organization: institutionId,
      enabled: true,
      isDeleted: false,
      isSetPassword: true,
      password: await hashedOtpOrPassword("password123"),
      additionalPermissions: checkerAdditionalPermissions,
    };

    if (!existingChecker) {
      await userRepository.create(checkerPayload);

      logger.info("Vendor Checker user seeded successfully.");
    } else {
      await userRepository.updateOne({ _id: existingChecker._id }, checkerPayload);

      logger.info("Vendor Checker user updated successfully.");
    }
  } catch (error) {
    logger.error("Error seeding vendor institution and users:", error);
  }
}
