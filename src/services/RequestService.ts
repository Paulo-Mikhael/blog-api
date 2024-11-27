import type { MultipartFile } from "@fastify/multipart";
import { pipeline } from "node:stream/promises";
import fs from "node:fs";
import z from "zod";
import { v4 as uuidV4 } from "uuid";

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
  async uploadFile(fastifyMultipartFile: MultipartFile) {
    const file = fastifyMultipartFile.file;
    const folder = "uploads";
    const path = `${folder}/${fastifyMultipartFile.filename}`;
    const fileType = fastifyMultipartFile.mimetype.replace("image/", "");
    await pipeline(file, fs.createWriteStream(path));
    await fs.renameSync(path, `${folder}/${uuidV4()}.${fileType}`);
  }
}
