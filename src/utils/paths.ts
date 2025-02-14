import type { PathsObject } from "../types/PathsObject";
import { PostDocs } from "../docs/PostDocs";
import { normalizeRouteDocs } from "./normalizeRouteDocs";
import { UsersDocs } from "../docs/UsersDocs";
import { UserProfileDocs } from "../docs/UserProfileDocs";

const postDocs = new PostDocs();
const usersDocs = new UsersDocs();
const userProfileDocs = new UserProfileDocs();
const normalizedPostDocs = normalizeRouteDocs(postDocs.routesDocs);
const normalizedUsersDocs = normalizeRouteDocs(usersDocs.routesDocs);
const normalizedUserProfileDocs = normalizeRouteDocs(userProfileDocs.routeDocs);

export const paths: PathsObject = {
  ...normalizedUsersDocs,
  ...normalizedPostDocs,
  ...normalizedUserProfileDocs,
};
