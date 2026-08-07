import MongooseBaseRepository from "./lib/mongo-base-repo";
declare const userRepository: MongooseBaseRepository<import("./types").IUser>;
declare const customerRepository: MongooseBaseRepository<import("./types").ICustomer>;
declare const permissionRepository: MongooseBaseRepository<import("./types").IPermission>;
declare const institutionRepository: MongooseBaseRepository<import("./types").IInstitution>;
declare const permissionGroupRepository: MongooseBaseRepository<import("./types").IPermissionGroup>;
export { userRepository, customerRepository, permissionRepository, institutionRepository, permissionGroupRepository, };
export { connectDb, checkDbHealth, checkReplicaSetStatus, closeDb } from "./lib/db-config";
//# sourceMappingURL=repository.d.ts.map