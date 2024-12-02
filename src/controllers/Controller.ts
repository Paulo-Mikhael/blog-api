import type { RouteParams } from "../types/RouteParams";

export abstract class Controller {
  abstract getAll({ request, reply }: RouteParams): Promise<undefined>;
  abstract getById({ request, reply }: RouteParams): Promise<undefined>;
  abstract create({ request, reply }: RouteParams): Promise<undefined>;
  abstract delete({ request, reply }: RouteParams): Promise<undefined>;
  abstract update({ request, reply }: RouteParams): Promise<undefined>;
}
