import type { RouteParams } from "../types/RouteParams";

export abstract class CrudController {
  abstract create({ request, reply }: RouteParams): Promise<undefined>;
  abstract delete({ request, reply }: RouteParams): Promise<undefined>;
  abstract update({ request, reply }: RouteParams): Promise<undefined>;
}
