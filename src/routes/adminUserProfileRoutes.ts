import type { FastifyPluginAsync } from "fastify";
import { UserProfileModel } from "../models/UserProfileModel";
import { UserProfileService } from "../services/UserProfileService";
import { AdminUserProfileController } from "../controllers/AdminUserProfileController";

export const adminUserProfileRoutes: FastifyPluginAsync = async (app) => {
  const userProfileModel = new UserProfileModel();
  const userProfileService = new UserProfileService();
  const adminProfilesController = new AdminUserProfileController(
    userProfileModel,
    userProfileService
  );

  app.post("/admin/profiles/:id", (request, reply) => {
    adminProfilesController.create({ request, reply });
  });
  app.delete("/admin/profiles/:id", (request, reply) => {
    adminProfilesController.delete({ request, reply });
  });
  app.put("/admin/profiles/:id", (request, reply) => {
    adminProfilesController.update({ request, reply });
  });
  app.put("/admin/profiles/avatar/:id", (request, reply) => {
    adminProfilesController.updateAvatar({ request, reply });
  });
};
