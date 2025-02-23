import type { PathItemObject } from "../types/PathItemObject";
import type { RoutesDocs } from "./Docs";

export abstract class CrudDocs {
  abstract routesDocs: RoutesDocs;

  abstract createSchema(): PathItemObject;
  abstract deleteSchema(): PathItemObject;
  abstract updateSchema(): PathItemObject;
}
