import type { PathsObject } from "../types/PathsObject";
import { PostDocs } from "../docs/PostDocs";
import { normalizeRouteDocs } from "./normalizeRouteDocs";

const postDocs = new PostDocs();
const normalizedPostDocs = normalizeRouteDocs(postDocs.routesDocs);

export const paths: PathsObject = {
  ...normalizedPostDocs,
};
