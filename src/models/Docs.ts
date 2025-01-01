import type { PathItemObject } from "../types/PathItemObject";

export type RoutesDocs = {
  path: string;
  routeDocsArray: PathItemObject[];
}[];

export abstract class Docs {
  abstract routesDocs: RoutesDocs;

  abstract getAllSchema(): PathItemObject;
  abstract getByIdSchema(): PathItemObject;
  abstract createSchema(): PathItemObject;
  abstract deleteSchema(): PathItemObject;
  abstract updateSchema(): PathItemObject;
}
