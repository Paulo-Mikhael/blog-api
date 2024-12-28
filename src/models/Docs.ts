import type { PathItemObject } from "../types/PathItemObject";

export type RouteDocs = {
  path: string;
  routeDocs: PathItemObject[];
}[];

export abstract class Docs {
  abstract routesDocs: RouteDocs;

  abstract getAllSchema(): PathItemObject;
  abstract getByIdSchema(): PathItemObject;
  abstract createSchema(): PathItemObject;
  abstract deleteSchema(): PathItemObject;
  abstract updateSchema(): PathItemObject;
}
