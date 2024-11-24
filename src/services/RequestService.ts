import z from "zod";

export class RequestService {
  getParamId(params: unknown): string {
    const idParamsSchema = z.object({ id: z.string() });

    const validatedParams = idParamsSchema.parse(params);

    return validatedParams.id;
  }
  getQueryTakeSkip(query: unknown) {
    let take = 50;
    let skip = 0;
    const takeSkipQuerySchema = z.object({
      take: z.string().optional(),
      skip: z.string().optional(),
    });

    if (!takeSkipQuerySchema.parse(query)) return { take, skip };

    const validatedQuery = takeSkipQuerySchema.parse(query);
    const queryTake = Number(validatedQuery.take);
    const querySkip = Number(validatedQuery.skip);

    if (validatedQuery.take && queryTake !== 0) {
      take = queryTake;
    }
    if (validatedQuery.skip && querySkip !== 0) {
      skip = querySkip;
    }

    return {
      take,
      skip,
    };
  }
  getOneFile(formData: unknown) {}
}
