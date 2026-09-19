import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface StoredFile {
  fileId: string;
  originalName: string;
  mimeType: string;
  size: number;
  filePath: string;
  uploadedAt: string;
}

export interface StorageProvider {
  saveFile(buffer: Buffer, originalName: string, mimeType: string): Promise<StoredFile>;
  getFile(fileId: string): Promise<{ buffer: Buffer; meta: StoredFile } | null>;
  deleteFile(fileId: string): Promise<boolean>;
}

/**
 * Local private disk storage implementation.
 * Ensures files are stored outside of public/static directories and cannot be accessed without authorization.
 *
 * For Production Cloud Deployment (AWS S3, Google Cloud Storage, Azure Blob):
 * Swap this provider with an S3 / GCS implementation using presigned private URLs.
 */
export class PrivateDiskStorageProvider implements StorageProvider {
  private baseDir: string;
  private metadataFile: string;
  private registry: Map<string, StoredFile> = new Map();

  constructor(baseDir?: string) {
    this.baseDir = baseDir || path.join(process.cwd(), 'private_uploads');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
    this.metadataFile = path.join(this.baseDir, '.file_registry.json');
    this.loadRegistry();
  }

  private loadRegistry() {
    try {
      if (fs.existsSync(this.metadataFile)) {
        const data = fs.readFileSync(this.metadataFile, 'utf-8');
        const parsed = JSON.parse(data);
        for (const key of Object.keys(parsed)) {
          this.registry.set(key, parsed[key]);
        }
      }
    } catch {
      this.registry = new Map();
    }
  }

  private persistRegistry() {
    try {
      const obj: Record<string, StoredFile> = {};
      for (const [key, value] of this.registry.entries()) {
        obj[key] = value;
      }
      fs.writeFileSync(this.metadataFile, JSON.stringify(obj, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist file registry:', err);
    }
  }

  async saveFile(buffer: Buffer, originalName: string, mimeType: string): Promise<StoredFile> {
    const fileId = crypto.randomBytes(16).toString('hex');
    const safeExt = path.extname(originalName).toLowerCase() || '.bin';
    const filename = `${fileId}${safeExt}`;
    const filePath = path.join(this.baseDir, filename);

    fs.writeFileSync(filePath, buffer);

    const storedFile: StoredFile = {
      fileId,
      originalName: path.basename(originalName),
      mimeType,
      size: buffer.length,
      filePath,
      uploadedAt: new Date().toISOString(),
    };

    this.registry.set(fileId, storedFile);
    this.persistRegistry();

    return storedFile;
  }

  async getFile(fileId: string): Promise<{ buffer: Buffer; meta: StoredFile } | null> {
    const meta = this.registry.get(fileId);
    if (!meta) return null;
    if (!fs.existsSync(meta.filePath)) return null;

    const buffer = fs.readFileSync(meta.filePath);
    return { buffer, meta };
  }

  async deleteFile(fileId: string): Promise<boolean> {
    const meta = this.registry.get(fileId);
    if (!meta) return false;
    if (fs.existsSync(meta.filePath)) {
      try {
        fs.unlinkSync(meta.filePath);
      } catch {
        // ignore
      }
    }
    this.registry.delete(fileId);
    this.persistRegistry();
    return true;
  }
}

export const storage = new PrivateDiskStorageProvider();
