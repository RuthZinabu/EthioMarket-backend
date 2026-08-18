import { formatErrorResponse, successResponse } from "@emacare/shared-utils";
import { getSeaweedService } from "../configs/seaweed-config";
import { Request, Response } from "express";

export interface ExpressFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export async function uploadFileToSeaweed(file: ExpressFile, prefix: string): Promise<string> {
  const seaweed = getSeaweedService();
  const timestamp = Date.now();
  const cleanFilename = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
  const folder = prefix.startsWith("product") ? "products" : "vendors";
  const destinationPath = `${folder}/${prefix}_${timestamp}_${cleanFilename}`;
  const result = await seaweed.uploadFile(file, destinationPath);
  return result.image;
}

export async function handleProductImageUploads(req: Request, body: Record<string, any>) {
  const files = req.files as { [fieldname: string]: ExpressFile[] } | undefined;
  const singleFile = req.file as ExpressFile | undefined;

  if (files?.image?.[0]) {
    body.image = await uploadFileToSeaweed(files.image[0], "product_image");
  } else if (singleFile) {
    body.image = await uploadFileToSeaweed(singleFile, "product_image");
  }

  if (files?.images && files.images.length > 0) {
    const uploadedUrls = await Promise.all(
      files.images.map((file) => uploadFileToSeaweed(file, "product_images"))
    );
    body.images = [...(Array.isArray(body.images) ? body.images : []), ...uploadedUrls];
  }
}