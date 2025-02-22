import type { PathsObject } from "../types/PathsObject";
import { PostDocs } from "../docs/PostDocs";
import { normalizeRouteDocs } from "./normalizeRouteDocs";
import { UsersDocs } from "../docs/UsersDocs";
import { UserProfileDocs } from "../docs/UserProfileDocs";

const postDocs = new PostDocs();
const normalizedPostDocs = normalizeRouteDocs(postDocs.routesDocs);
const usersDocs = new UsersDocs();
const normalizedUsersDocs = normalizeRouteDocs(usersDocs.routesDocs);
const userProfileDocs = new UserProfileDocs();
const normalizedUserProfileDocs = normalizeRouteDocs(userProfileDocs.routeDocs);

export const paths: PathsObject = {
  ...normalizedUsersDocs,
  ...normalizedPostDocs,
  ...normalizedUserProfileDocs,
};
