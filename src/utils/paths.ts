import type { PathsObject } from "../types/PathsObject";
import { PostDocs } from "../docs/PostDocs";
import { normalizeRouteDocs } from "./normalizeRouteDocs";
import { UsersDocs } from "../docs/UsersDocs";
import { UserProfileDocs } from "../docs/UserProfileDocs";
import { AdminUserDocs } from "../docs/AdminUserDocs";
import { AdminPostDocs } from "../docs/AdminPostDocs";

const postDocs = new PostDocs();
const normalizedPostDocs = normalizeRouteDocs(postDocs.routesDocs);
const usersDocs = new UsersDocs();
const normalizedUsersDocs = normalizeRouteDocs(usersDocs.routesDocs);
const userProfileDocs = new UserProfileDocs();
const normalizedUserProfileDocs = normalizeRouteDocs(
  userProfileDocs.routesDocs
);
const adminUserDocs = new AdminUserDocs();
const normalizedAdminUserDocs = normalizeRouteDocs(adminUserDocs.routesDocs);
const adminPostDocs = new AdminPostDocs();
const normalizedAdminPostDocs = normalizeRouteDocs(adminPostDocs.routesDocs);

export const paths: PathsObject = {
  ...normalizedUsersDocs,
  ...normalizedPostDocs,
  ...normalizedUserProfileDocs,
  ...normalizedAdminUserDocs,
  ...normalizedAdminPostDocs,
};
