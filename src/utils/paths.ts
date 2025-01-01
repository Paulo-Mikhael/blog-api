import type { PathsObject } from "../types/PathsObject";
import { PostDocs } from "../docs/PostDocs";
import { normalizeRouteDocs } from "./normalizeRouteDocs";
import { UsersDocs } from "../docs/UsersDocs";

const postDocs = new PostDocs();
const usersDocs = new UsersDocs();
const normalizedPostDocs = normalizeRouteDocs(postDocs.routesDocs);
const normalizedUsersDocs = normalizeRouteDocs(usersDocs.routesDocs);

export const paths: PathsObject = {
  ...normalizedPostDocs,
  ...normalizedUsersDocs,
};
