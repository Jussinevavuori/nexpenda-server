import * as express from "express";
import * as multer from "multer";
import { avatarRouter } from "..";
import { AvatarService } from "../../services/AvatarService";
import { InvalidRequestDataFailure } from "../../utils/Failures";
// import { bucket } from "../../server";
// import { UnauthenticatedFailure } from "../../utils/Failures";

const multerMemoryStorage = multer({
  storage: multer.memoryStorage(),
  limits: {
    // 5 Mb
    fileSize: 5 * 1024 * 1024,
  },
});

avatarRouter.post(
  "/",
  multerMemoryStorage.single("file"),
  express.urlencoded({ extended: false }),
  async (req, res, next) => {
    // Ensure user is authenticated
    // const user = req.data.auth.user;
    // if (!user) {
    //   next(new UnauthenticatedFailure());
    // }

    // Get and validate file
    const file = req.file;
    if (!file) {
      return next(new InvalidRequestDataFailure({ _file: "No file provided" }));
    }

    try {
      const result = await AvatarService.uploadProfilePicture({ file });

      if (result.isSuccess()) {
        console.log(`Image available at: ${result.value}`);
      } else {
        console.warn(result);
      }
    } catch (e) {
      console.log(e);
    } finally {
      return res.end();
    }
  }
);
