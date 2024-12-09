import type { FieldParams } from "../types/FieldParams";

export abstract class Model<T> {
  abstract getAll(take: number, skip: number): Promise<T[] | Omit<T, any>>;
  abstract getById(id: string): Promise<T | null | Omit<T, any>>;
  abstract getByField(
    fieldParams: FieldParams<T>,
    take: number,
    skip: number
  ): Promise<T[] | Omit<T, any>>;
  abstract create(model: T): Promise<{ [model: string]: T }>;
  abstract delete(id: string): Promise<void>;
  abstract update(id: string, newModel: T): Promise<void>;
}
