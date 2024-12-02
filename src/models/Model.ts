export abstract class Model<T> {
  abstract getAll(take: number, number: number): Promise<T[]>;
  abstract getById(id: string): Promise<T>;
  abstract create(model: T): Promise<{ [modelId: string]: string }>;
  abstract delete(id: string): Promise<void>;
  abstract update(id: string, newModel: T): Promise<void>;
}
