import { feedbackRouter } from "..";
import { conf } from "../../conf";
import { FeedbackReceivedTempate } from "../../mailTemplates/FeedbackReceivedTemplate";
import { postFeedbackSchema } from "../../schemas/feedback.schema";
import { prisma } from "../../server";
import { Mailer } from "../../services/Mailer";
import { UnauthenticatedFailure } from "../../utils/Failures";
import { validateRequestBody } from "../../utils/validateRequestBody";

feedbackRouter.post("/", async (req, res, next) => {
  if (!req.data.auth.user) {
    return next(new UnauthenticatedFailure());
  }

  // Validate request body
  const body = await validateRequestBody(req, postFeedbackSchema);
  if (body.isFailure()) {
    return next(body);
  }

  // Upload feedback
  await prisma.feedback.create({
    data: {
      message: body.value.message,
      User: {
        connect: {
          id: req.data.auth.user.id,
        },
      },
    },
  });

  // Send feedback alert
  try {
    const mailer = new Mailer();

    const passwordChangedTemplate = new FeedbackReceivedTempate({
      email: req.data.auth.user.email ?? "No email",
      displayName: req.data.auth.user.profile.displayName ?? "No display name",
      message: body.value.message ?? "(No message)",
    });

    for (const developerEmail of conf.email.developerEmails) {
      await mailer.sendTemplate(developerEmail, passwordChangedTemplate);
    }
  } catch (e) {
    console.error("Failed to send feedback mail");
  }

  // End
  res.end();
});
