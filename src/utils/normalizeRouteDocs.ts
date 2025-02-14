import type { RoutesDocs } from "../models/Docs";
import type { PathItemObject } from "../types/PathItemObject";

type NormalizedRoutes = {
  [pathName: string]: PathItemObject;
};

export function normalizeRouteDocs(
  documentation: RoutesDocs
): NormalizedRoutes {
  // Vai armazenar um nome de uma rota e suas documentações
  let normalizedRoutes: NormalizedRoutes = {};

  // Itera o array do tipo "RoutesDocs"
  for (let i = 0; i < documentation.length; i++) {
    // Nome/Acesso da rota
    const path = documentation[i].path;
    // "routeDocs" tem um array das documentações da rota
    const routeDocsArray = documentation[i].routeDocsArray;
    // Guarda as rotas documentadas de "routeDocsArray" como um objeto
    let routeDocs: PathItemObject = {};

    routeDocsArray.map((docs) => {
      // Declara "routeDocs" com o mesmo valor + a nova documentação de rota
      routeDocs = {
        ...routeDocs,
        ...docs,
      };
    });

    // Declara "normalizedRoutes" com o mesmo valor + o nome de uma nova rota e suas documentações
    normalizedRoutes = {
      ...normalizedRoutes,
      [path]: routeDocs,
    };
  }

  // console.log(normalizedRoutes); // Rotas normalizadas

  return normalizedRoutes;
}
