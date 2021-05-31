import * as sharp from "sharp";
import { Request } from "express";
import { bucket } from "../server";
import { ImageFailure } from "../utils/Failures";
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
   * Construct a filename from the file's own name and the folder. Replaces
   * all whitespaces with an underscore.
   */
  static getFilename(folder: string, name: string) {
    const fileName = name.replace(/\s+/g, "_");
    return `images/${folder}/${fileName}`;
  }

  /**
   * Upload a picture buffer to Google Cloud Storage. Requires a folder and a
   * name for the file in order to save to GCS. Optionally the file can be made
   * public to all users and processed with a sharp function.
   */
  static uploadImage(args: {
    buffer: Buffer;
    folder: string;
    name: string;
    public?: boolean;
    processImage?: (b: sharp.Sharp) => sharp.Sharp;
  }): Promise<Success<string> | ImageFailure<string>> {
    return new Promise(async (resolve, reject) => {
      // Combine folder and filename into full name
      const filename = ImageService.getFilename(args.folder, args.name);

      // Create bucket and get its write stream
      const bucketFile = bucket.file(filename);
      const writeStream = bucketFile.createWriteStream({ resumable: false });

      // Get image buffer with optional sharp processing applied.
      // If no sharp processing specified, use emtpy processing function
      // which returns raw sharp object as is.
      const processImage = args.processImage ?? ((_: sharp.Sharp) => _);
      const buffer = await processImage(sharp(args.buffer)).toBuffer();

      // When finished, return new success to the user containing the bucket
      // file's public URL.
      function handleWriteStreamFinished() {
        resolve(new Success<string>(bucketFile.publicUrl()));

        // Make the file public if specified in options.
        if (args.public) {
          bucketFile.makePublic().catch(() => {
            console.error(`Failed to make file ${bucketFile.name} public`);
          });
        }
      }

      // On error resolve with ImageFailure with message derived from the error
      function handleWriteStreamError(e: Error) {
        const msg = `Failure while uploading image: ${e.message} (${e.name})`;
        resolve(new ImageFailure<string>().withMessage(msg));
      }

      // Read file to blob stream
      writeStream
        .on("finish", handleWriteStreamFinished)
        .on("error", handleWriteStreamError)
        .end(buffer);
    });
  }
}
