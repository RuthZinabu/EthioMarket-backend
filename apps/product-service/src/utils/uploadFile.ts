import { getSeaweedService } from "../configs/seaweed-config";

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
  const destinationPath = `vendors/${prefix}_${timestamp}_${cleanFilename}`;
  const result = await seaweed.uploadFile(file, destinationPath);
  return result.image;
}
