import * as express from "express";
import * as multer from "multer";
import { avatarRouter } from "..";
import { rateLimiters } from "../../middleware/rateLimiters";
import { prisma } from "../../server";
import { AvatarService } from "../../services/AvatarService";
import { UserService } from "../../services/UserService";
import {
  InvalidRequestDataFailure,
  UnknownFailure,
} from "../../utils/Failures";
import { UnauthenticatedFailure } from "../../utils/Failures";

const multerMemoryStorage = multer({
  storage: multer.memoryStorage(),
  limits: {
    // 10 Mb
    fileSize: 10 * 1024 * 1024,
  },
});

avatarRouter.post(
  "/",
  rateLimiters.strict(),
  multerMemoryStorage.single("file"),
  express.urlencoded({ extended: false }),
  async (req, res, next) => {
    // Ensure user is authenticated
    const user = req.data.auth.user;
    if (!user) {
      return next(new UnauthenticatedFailure());
    }

    // Get file and ensure it exists
    const file = req.file;
    if (!file) {
      return next(new InvalidRequestDataFailure({ _file: "No file provided" }));
    }

    // Upload image to bucket
    const result = await AvatarService.uploadProfilePicture({ file });

    // Get public URL from result or throw error
    const publicUrl = result.getOr("");
    if (!publicUrl) {
      return next(new UnknownFailure());
    }

    // Update photo URL to user's profile
    const updatedProfile = await prisma.profile.update({
      where: { uid: user.id },
      data: { photoUrl: publicUrl },
    });

    // Respond with updated auth
    const response = await UserService.createResponse(user, updatedProfile);
    res.json(response);
  }
);
