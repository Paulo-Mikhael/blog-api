import type { RouteDocs } from "../models/Docs";
import type { PathItemObject } from "../types/PathItemObject";

type NormalizedRoutes = {
  [pathName: string]: PathItemObject;
};

export function normalizeRouteDocs(documentation: RouteDocs): NormalizedRoutes {
  let normalizedRoutes: NormalizedRoutes = {};

  for (let i = 0; i < documentation.length; i++) {
    const path = documentation[i].path;
    const routeDocs = documentation[i].routeDocs;
    let routesDocs: PathItemObject = {};

    routeDocs.map((docs) => {
      console.log(docs);
      routesDocs = {
        ...routesDocs,
        ...docs,
      };
    });

    normalizedRoutes = {
      ...normalizedRoutes,
      [path]: routesDocs,
    };
  }

  console.log(normalizedRoutes);
  return normalizedRoutes;
}
