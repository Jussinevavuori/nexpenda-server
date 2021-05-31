import { Request } from "express";
import { v4 as uuid } from "uuid";
import { ImageService } from "./ImageService";

export class AvatarService {
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
