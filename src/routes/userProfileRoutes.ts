import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { UserProfileModel } from "../models/UserProfileModel";
import { UserProfileService } from "../services/UserProfileService";
import { UserProfileController } from "../controllers/UserProfileController";

export const userProfileRoutes: FastifyPluginAsyncZod = async (app) => {
  const userProfileModel = new UserProfileModel();
  const userProfileService = new UserProfileService();
  const userProfile = new UserProfileController(
    userProfileModel,
    userProfileService
  );

  app.get("/profiles", (request, reply) => {
    userProfile.getAll({ request, reply });
  });
  app.get("/profiles/:id", (request, reply) => {
    userProfile.getById({ request, reply });
  });
  app.post("/profiles", (request, reply) => {
    userProfile.create({ request, reply });
  });
  app.delete("/profiles/:id", (request, reply) => {
    userProfile.delete({ request, reply });
  });
  app.put("/profiles/:id", (request, reply) => {
    userProfile.update({ request, reply });
  });
};
