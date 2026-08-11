import MongooseBaseRepository from "./lib/mongo-base-repo";
import CustomerModel from "./models/customer.model";
import UserModel from "./models/user.model";
import PermissionModel from "./models/permission.model";
import InstitutionModel from "./models/institution.model";
import PermissionGroupModel from "./models/permission-group.model";
import VendorModel from "./models/vendor.model";
import VendorPayoutModel from "./models/vendor-payout.model";

const userRepository = new MongooseBaseRepository(UserModel);
const customerRepository = new MongooseBaseRepository(CustomerModel);
const permissionRepository = new MongooseBaseRepository(PermissionModel);
const institutionRepository = new MongooseBaseRepository(InstitutionModel);
const permissionGroupRepository = new MongooseBaseRepository(PermissionGroupModel);
const vendorRepository = new MongooseBaseRepository(VendorModel);
const vendorPayoutRepository = new MongooseBaseRepository(VendorPayoutModel);

export {
  userRepository,
  customerRepository,
  permissionRepository,
  institutionRepository,
  permissionGroupRepository,
  vendorRepository,
  vendorPayoutRepository,
};

export { connectDb, checkDbHealth, checkReplicaSetStatus, closeDb } from "./lib/db-config";
