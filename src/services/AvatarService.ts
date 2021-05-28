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
      file: args.file,
      folder: AvatarService.folder,
      filename: `avatar__${uuid()}`,
      public: true,
    });
  }
}
