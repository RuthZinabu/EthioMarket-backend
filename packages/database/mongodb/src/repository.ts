import MongooseBaseRepository from "./lib/mongo-base-repo";
import CustomerModel from "./models/customer.model";
import UserModel from "./models/user.model";
import PermissionModel from "./models/permission.model";
import InstitutionModel from "./models/institution.model";
import PermissionGroupModel from "./models/permission-group.model";
import VendorModel from "./models/vendor.model";
import VendorPayoutModel from "./models/vendor-payout.model";
import ProductModel from "./models/product.model";
import OrderModel from "./models/order.model";
import CartModel from "./models/cart.model";
import PaymentModel from "./models/payment.model";
import ShipmentModel from "./models/shipment.model";

const userRepository = new MongooseBaseRepository(UserModel);
const customerRepository = new MongooseBaseRepository(CustomerModel);
const permissionRepository = new MongooseBaseRepository(PermissionModel);
const institutionRepository = new MongooseBaseRepository(InstitutionModel);
const permissionGroupRepository = new MongooseBaseRepository(PermissionGroupModel);
const vendorRepository = new MongooseBaseRepository(VendorModel);
const vendorPayoutRepository = new MongooseBaseRepository(VendorPayoutModel);
const productRepository = new MongooseBaseRepository(ProductModel);
const orderRepository = new MongooseBaseRepository(OrderModel);
const cartRepository = new MongooseBaseRepository(CartModel);
const paymentRepository = new MongooseBaseRepository(PaymentModel);
const shipmentRepository = new MongooseBaseRepository(ShipmentModel);

export {
  userRepository,
  customerRepository,
  permissionRepository,
  institutionRepository,
  permissionGroupRepository,
  vendorRepository,
  vendorPayoutRepository,
  productRepository,
  orderRepository,
  cartRepository,
  paymentRepository,
  shipmentRepository,
};

export { connectDb, checkDbHealth, checkReplicaSetStatus, closeDb } from "./lib/db-config";
