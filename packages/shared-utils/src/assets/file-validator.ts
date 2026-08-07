/// <reference types="multer" />
import { type Request, type Response, type NextFunction } from "express";
import { BadRequestException } from "../common/app-exception";

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer?: Buffer;
  destination?: string;
  filename?: string;
  path?: string;
}

interface SingleFileValidationConfig {
  allowedTypes: string[];
  required?: boolean;
  maxSizeMB?: number;
}
export function createSingleFileValidator(config: SingleFileValidationConfig) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const defaultMaxSizeMB = 20;
    const file = req.file;

    if (config.required && !file) {
      throw new BadRequestException({ message: `File is required` });
    }

    if (file) {
      const maxSize = config.maxSizeMB ?? defaultMaxSizeMB;
      const sizeMB = file.size / (1024 * 1024);

      if (sizeMB > maxSize) {
        throw new BadRequestException({
          message: `File exceeds maximum size of ${maxSize}MB`,
        });
      }

      if (!config.allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException({
          message: `Invalid file type. Allowed types: ${config.allowedTypes.join(", ")}`,
        });
      }
    }

    next();
  };
}

interface FileValidationConfig {
  [fieldname: string]: {
    allowedTypes: string[];
    required?: boolean;
    maxSizeMB?: number;
  };
}
interface FileValidationOptions {
  defaultMaxSizeMB: number;
}
const defaultValidationOptions: FileValidationOptions = {
  defaultMaxSizeMB: 20,
};

export function createFileValidator(
  config: FileValidationConfig,
  options: FileValidationOptions = defaultValidationOptions,
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const files = (req.files as { [fieldname: string]: UploadedFile[] }) || {};

    // Validate required fields in the files list
    for (const [field, fieldConfig] of Object.entries(config)) {
      if (fieldConfig.required && !files[field]?.[0]) {
        throw new BadRequestException({ message: `${field} is required` });
      }
    }

    // Validate existing files
    for (const [fieldName, fieldFiles] of Object.entries(files)) {
      const fieldConfig = config[fieldName];

      // Check if field is allowed
      if (!fieldConfig) {
        throw new BadRequestException({
          message: `Unexpected file field: ${fieldName}`,
        });
      }

      for (const file of fieldFiles) {
        // Validate file size
        const maxSize = fieldConfig.maxSizeMB ?? options.defaultMaxSizeMB;
        const sizeMB = file.size / (1024 * 1024);

        if (sizeMB > maxSize) {
          throw new BadRequestException({
            message: `${fieldName} exceeds maximum size of ${maxSize}MB`,
          });
        }

        if (!fieldConfig.allowedTypes.includes(file.mimetype)) {
          throw new BadRequestException({
            message: `Invalid file type for ${fieldName}. Allowed types: ${fieldConfig.allowedTypes.join(", ")}`,
          });
        }
      }
    }

    next();
  };
}
