import { Request } from "express";
import { v4 as uuid } from "uuid";
import { ImageService } from "./ImageService";

export class AvatarService {
  /**
   * Regex for checking which urls are allowed to directly
   * be set as the allowed photo URL.
   */
  static allowedDirectPhotoUrlRegex =
    /^https:\/\/lh\d+.googleusercontent.com\//;

  /**
   * Check whether an URL is an allowed direct photo URL.
   */
  static isAllowedDirectPhotoUrl(url: string) {
    return AvatarService.allowedDirectPhotoUrlRegex.test(url);
  }

  /**
   * Default folder for all avatars
   */
  static folder = "avatars";

  /**
   * Upload a profile picture.
   */
  static uploadProfilePicture(args: { file: Request["file"] }) {
    return ImageService.uploadImage({
      buffer: args.file.buffer,
      folder: AvatarService.folder,
      name: `avatar__${uuid()}`,
      public: true,
      processImage: (image) => image.resize(200),
    });
  }
}
