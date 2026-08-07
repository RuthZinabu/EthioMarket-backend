import axios, { AxiosError } from "axios";
import FormData from "form-data";
import { lookup as mimeLookup } from "mime-types";
import type { Readable } from "stream";
import { logger } from "../utils/logger";

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

function cleanKey(raw: string) {
  let k = raw
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s*\.\s*/g, ".")
    .replace(/\/{2,}/g, "/");
  k = k.replace(/\s+/g, "-");
  k = k.replace(/^\/+/, "");
  return k;
}

export class SeaweedFSService {
  private filerUrl: string;
  private publicUrl: string;
  private folderName: string;

  constructor(config: {
    filerUrl: string; // Internal URL for uploads (e.g. http://seaweedfs-filer:8888)
    publicUrl: string; // Public URL for access (e.g. http://files.example.com)
    folderName: string;
  }) {
    this.filerUrl = config.filerUrl.endsWith("/") ? config.filerUrl.slice(0, -1) : config.filerUrl;
    this.publicUrl = config.publicUrl.endsWith("/")
      ? config.publicUrl.slice(0, -1)
      : config.publicUrl;
    this.folderName = config.folderName;
  }

  private buildKey(destinationPath: string) {
    const left = this.folderName ? `${this.folderName}/` : "";
    return cleanKey(`${left}${destinationPath}`);
  }

  public async uploadFile(
    file: UploadedFile | Buffer,
    destinationPath: string,
  ): Promise<{ image: string }> {
    const key = this.buildKey(destinationPath);
    const body: Buffer = Buffer.isBuffer(file) ? file : file.buffer!;
    const filename = !Buffer.isBuffer(file)
      ? file.originalname
      : destinationPath.split("/").pop() || "file";
    const contentType =
      (!Buffer.isBuffer(file) && file.mimetype) ||
      (mimeLookup(key) as string) ||
      "application/octet-stream";

    const form = new FormData();
    form.append("file", body, {
      filename,
      contentType,
    });

    const uploadUrl = `${this.filerUrl}/${key}`;

    try {
      // Ensure directory exists or just let SeaweedFS handle it (Filer handles nested paths)
      await axios.post(uploadUrl, form, {
        headers: {
          ...form.getHeaders(),
        },
      });
      return { image: `${this.filerUrl}/${key}` };
    } catch (err: unknown) {
      const error = err as AxiosError;
      logger.error("Error uploading file to SeaweedFS", {
        err: error.message,
        url: uploadUrl,
      });
      throw {
        success: false,
        status: 500,
        message: "Unable to upload file to SeaweedFS",
      };
    }
  }

  public async getObject(filename: string) {
    const key = this.buildKey(filename);
    const url = `${this.filerUrl}/${key}`;
    try {
      const response = await axios.get(url, { responseType: "stream" });
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError;
      logger.error("Error getting object from SeaweedFS", {
        err: error.message,
        url,
      });
      throw new Error(`Failed to get object: ${error.message}`);
    }
  }

  public async checkFileExists(destinationPath: string): Promise<boolean> {
    const key = this.buildKey(destinationPath);
    const url = `${this.filerUrl}/${key}`;
    try {
      await axios.head(url);
      return true;
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.response && error.response.status === 404) {
        return false;
      }
      logger.error("Error checking file existence in SeaweedFS", {
        err: error.message,
        url,
      });
      throw error;
    }
  }

  public async deleteFile(destinationPath: string): Promise<boolean> {
    const key = this.buildKey(destinationPath);
    const url = `${this.filerUrl}/${key}`;
    try {
      await axios.delete(url);
      return true;
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.response && error.response.status === 404) {
        return false;
      }
      logger.error("Error deleting file from SeaweedFS", {
        err: error.message,
        url,
      });
      throw {
        success: false,
        status: 500,
        message: "Unable to delete file from SeaweedFS",
      };
    }
  }

  public async uploadStream(
    stream: Readable,
    destinationPath: string,
    contentType = "text/csv",
  ): Promise<{ fileUrl: string }> {
    const key = this.buildKey(destinationPath);
    const url = `${this.filerUrl}/${key}`;

    try {
      // Axios can take a ReadableStream as data
      await axios.post(url, stream, {
        headers: {
          "Content-Type": contentType,
        },
      });
      return { fileUrl: `${this.publicUrl}/${key}` };
    } catch (err: unknown) {
      const error = err as AxiosError;
      logger.error("Error uploading stream to SeaweedFS", {
        err: error.message,
        url,
        key,
      });
      throw {
        success: false,
        status: 500,
        message: "Unable to upload stream to SeaweedFS",
      };
    }
  }
}
