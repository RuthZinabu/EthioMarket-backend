import { SeaweedFSService } from "@emacare/shared-utils";
let seaweedService: SeaweedFSService | null = null;

export function getSeaweedService(): SeaweedFSService {
  if (!seaweedService) {
    const config = globalThis._CONFIG
    const cfg = {
      filerUrl: config?.SEAWEEDFS_FILER_URL || process.env.SEAWEEDFS_FILER_URL || "http://localhost:8888",
      publicUrl: config?.SEAWEEDFS_PUBLIC_URL || process.env.SEAWEEDFS_PUBLIC_URL || "http://localhost:8888",
      folderName: config?.SEAWEEDFS_FOLDER_NAME || process.env.SEAWEEDFS_FOLDER_NAME || "emacare_files",
    };
    seaweedService = new SeaweedFSService(cfg);
  }
  return seaweedService;
}
