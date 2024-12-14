import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { UserProfileModel } from "../models/UserProfileModel";
import { UserProfileService } from "../services/UserProfileService";
import { UserProfileController } from "../controllers/UserProfileController";
import { UserProfileDocs } from "../docs/UserProfileDocs";

export const userProfileRoutes: FastifyPluginAsyncZod = async (app) => {
  const userProfileModel = new UserProfileModel();
  const userProfileService = new UserProfileService();
  const userProfile = new UserProfileController(
    userProfileModel,
    userProfileService
  );
  const profileDocs = new UserProfileDocs();

  app.get("/profiles", {
    schema: profileDocs.getAllSchema(),
    handler: (request, reply) => userProfile.getAll({ request, reply }),
  });
  app.get("/profiles/:id", {
    schema: profileDocs.getByIdSchema(),
    handler: (request, reply) => userProfile.getById({ request, reply }),
  });
  app.post("/profiles", {
    schema: profileDocs.createSchema(),
    handler: (request, reply) => userProfile.create({ request, reply }),
  });
  app.delete("/profiles", {
    schema: profileDocs.deleteSchema(),
    handler: (request, reply) => userProfile.delete({ request, reply }),
  });
  app.put("/profiles", {
    schema: profileDocs.updateSchema(),
    handler: (request, reply) => userProfile.update({ request, reply }),
  });
};
