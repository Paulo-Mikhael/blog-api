import type { FieldParams } from "../types/FieldParams";

export abstract class Model<T> {
  abstract getAll(take: number, skip: number): Promise<T[]>;
  abstract getById(id: string): Promise<T | null>;
  abstract getByField(
    fieldParams: FieldParams,
    take: number,
    skip: number
  ): Promise<T[]>;
  abstract create(model: T): Promise<{ [model: string]: T }>;
  abstract delete(id: string): Promise<void>;
  abstract update(id: string, newModel: T): Promise<void>;
}
