import type { Request, Response } from "express";
import { formatErrorResponse, successResponse } from "@emacare/shared-utils";
import { VendorStatus } from "@emacare/mongo/types";
import vendorDal from "../dal/vendor.dal";
import {
  CreateVendorSchema,
  UpdateVendorSchema,
  ApproveVendorSchema,
  VendorQuerySchema,
} from "../validations/vendorSchema";
import { ExpressFile, uploadFileToSeaweed } from "../utils/uploadFile";

export async function uploadVendorAsset(req: Request, res: Response) {
  try {
    const file = req.file as ExpressFile | undefined;
    if (!file) {
      return res.status(400).json(formatErrorResponse({ message: "No file uploaded" }, 400));
    }
    const fileUrl = await uploadFileToSeaweed(file, "asset");
    return res.json(successResponse({ fileUrl }));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function createVendor(req: Request, res: Response) {
  try {
    const files = req.files as { [fieldname: string]: ExpressFile[] } | undefined;
    const body = { ...req.body };

    if (typeof body.payoutBankDetails === "string") {
      try { body.payoutBankDetails = JSON.parse(body.payoutBankDetails); } catch {}
    }
    if (typeof body.businessDetail === "string") {
      try { body.businessDetail = JSON.parse(body.businessDetail); } catch {}
    }

    if (files) {
      if (files.logo?.[0]) {
        body.logo = await uploadFileToSeaweed(files.logo[0], "logo");
      }
      if (files.bannerImage?.[0]) {
        body.bannerImage = await uploadFileToSeaweed(files.bannerImage[0], "banner");
      }
      if (files.businessLicense?.[0]) {
        const licenseUrl = await uploadFileToSeaweed(files.businessLicense[0], "license");
        body.businessDetail = {
          ...(body.businessDetail || {}),
          businessLicense: licenseUrl,
        };
      }
    }

    const parseResult = CreateVendorSchema.safeParse(body);
    if (!parseResult.success) {
      return res.status(400).json(
        formatErrorResponse(
          { message: "Validation failed", errors: parseResult.error.issues },
          400
        )
      );
    }

    const vendor = await vendorDal.createVendor(parseResult.data as any);
    return res.status(201).json(successResponse(vendor, 201));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function getAllVendors(req: Request, res: Response) {
  try {
    const parseResult = VendorQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json(
        formatErrorResponse(
          { message: "Invalid query parameters", errors: parseResult.error.issues },
          400
        )
      );
    }

    const { status, vendorType, country, search, page = 1, limit = 10 } = parseResult.data;
    const filter: Record<string, any> = {};

    if (status) filter.status = status;
    if (vendorType) filter.vendorType = vendorType;
    if (country) filter.country = country;
    if (search) {
      filter.$or = [
        { storeName: { $regex: new RegExp(search, "i") } },
        { ownerName: { $regex: new RegExp(search, "i") } },
        { contactEmail: { $regex: new RegExp(search, "i") } },
      ];
    }

    const paginatedResult = await vendorDal.getVendorsPaginated(filter, page, limit);
    return res.json(successResponse(paginatedResult));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function getVendorById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(formatErrorResponse({ message: "Vendor id or slug is required" }, 400));
    }

    const vendor = await vendorDal.getVendorById(id);
    if (!vendor) {
      return res.status(404).json(formatErrorResponse({ message: "Vendor not found" }, 404));
    }

    return res.json(successResponse(vendor));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function updateVendor(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(formatErrorResponse({ message: "Vendor id or slug is required" }, 400));
    }

    const files = req.files as { [fieldname: string]: ExpressFile[] } | undefined;
    const body = { ...req.body };

    if (typeof body.payoutBankDetails === "string") {
      try { body.payoutBankDetails = JSON.parse(body.payoutBankDetails); } catch {}
    }
    if (typeof body.businessDetail === "string") {
      try { body.businessDetail = JSON.parse(body.businessDetail); } catch {}
    }

    if (files) {
      if (files.logo?.[0]) {
        body.logo = await uploadFileToSeaweed(files.logo[0], "logo");
      }
      if (files.bannerImage?.[0]) {
        body.bannerImage = await uploadFileToSeaweed(files.bannerImage[0], "banner");
      }
      if (files.businessLicense?.[0]) {
        const licenseUrl = await uploadFileToSeaweed(files.businessLicense[0], "license");
        body.businessDetail = {
          ...(body.businessDetail || {}),
          businessLicense: licenseUrl,
        };
      }
    }

    const parseResult = UpdateVendorSchema.safeParse(body);
    if (!parseResult.success) {
      return res.status(400).json(
        formatErrorResponse(
          { message: "Validation failed", errors: parseResult.error.issues },
          400
        )
      );
    }

    const updatedVendor = await vendorDal.updateVendor(id, parseResult.data as any);
    if (!updatedVendor) {
      return res.status(404).json(formatErrorResponse({ message: "Vendor not found" }, 404));
    }

    return res.json(successResponse(updatedVendor));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function approveVendor(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(formatErrorResponse({ message: "Vendor id or slug is required" }, 400));
    }

    const parseResult = ApproveVendorSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(
        formatErrorResponse(
          { message: "Validation failed", errors: parseResult.error.issues },
          400
        )
      );
    }

    const { status, rejectedReason } = parseResult.data;
    const updateData: Record<string, any> = {
      status,
      enabled: status === VendorStatus.APPROVED,
    };

    if (status === VendorStatus.APPROVED) {
      updateData.approvedAt = new Date();
    } else if (status === VendorStatus.REJECTED) {
      updateData.rejectedReason = rejectedReason;
    }

    const vendor = await vendorDal.updateVendor(id, updateData);
    if (!vendor) {
      return res.status(404).json(formatErrorResponse({ message: "Vendor not found" }, 404));
    }

    return res.json(successResponse(vendor));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function deleteVendor(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(formatErrorResponse({ message: "Vendor id or slug is required" }, 400));
    }

    const vendor = await vendorDal.softDeleteVendor(id);
    if (!vendor) {
      return res.status(404).json(formatErrorResponse({ message: "Vendor not found" }, 404));
    }

    return res.json(successResponse({ message: "Vendor deleted successfully" }));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export default {
  uploadVendorAsset,
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  approveVendor,
  deleteVendor,
};
