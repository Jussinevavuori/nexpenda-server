import { Request } from "express";
import { bucket } from "../server";
import { ImageFailure, UnknownFailure } from "../utils/Failures";
import { Success } from "../utils/Result";

/**
 * Handles images with google cloud storage.
 */
export class ImageService {
  /**
   * All valid mime types
   */
  static validMimeTypes = { jpeg: "image/jpeg", png: "image/png" };

  /**
   * Check if a provided mime type is a valid mimetype.
   */
  static isValidMimeType(arg: string | Request["file"]) {
    const mimetype = typeof arg === "string" ? arg : arg.mimetype;
    return Object.values(ImageService.validMimeTypes).includes(mimetype);
  }

  /**
   * Update a files filename. Preserve original file ending.
   */
  static updateFilename(file: Request["file"], filename: string) {
    const [, extension] = file.originalname.split(".");
    if (extension) {
      file.originalname = `${filename}.${extension}`;
    } else {
      file.originalname = filename;
    }
  }

  /**
   * Get file name
   */
  static getFileName(folder: string, file: Request["file"]) {
    const fileName = file.originalname.replace(/\s+/g, "_");
    return `images/${folder}/${fileName}`;
  }

  /**
   * Upload a profile picture.
   */
  static uploadImage(args: {
    file: Request["file"];
    folder: string;
    filename?: string;
    public?: boolean;
  }): Promise<Success<string> | UnknownFailure<string>> {
    return new Promise(async (resolve, reject) => {
      const file = args.file;
      const folder = args.folder;

      // Change filename when specified
      if (args.filename) {
        ImageService.updateFilename(file, args.filename);
      }

      // Validate mime type
      if (!ImageService.isValidMimeType(file)) {
        reject(new ImageFailure().withMessage(""));
      }

      // Create blob and blob stream
      const bucketFile = bucket.file(ImageService.getFileName(folder, file));
      const blobStream = bucketFile.createWriteStream({ resumable: false });

      // Read file to blob stream
      blobStream
        .on("finish", () => {
          resolve(new Success<string>(bucketFile.publicUrl()));

          // Make the file public if specified
          if (args.public) {
            bucketFile.makePublic().catch(() => {
              console.error(`Failed to make file ${bucketFile.name} public`);
            });
          }
        })
        .on("error", (e) => {
          reject(
            new UnknownFailure().withMessage(
              `Failure while uploading image: ${e.message} (${e.name})`
            )
          );
        })
        .end(args.file.buffer);
    });
  }
}
