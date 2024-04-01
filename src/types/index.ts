export interface IBaseModel<T> {
  save(record: T): Promise<T>;
  retrieveAll(searchParams: Partial<T>): Promise<T[]>;
  retrieveById(recordId: number): Promise<T | undefined>;
  update(record: T): Promise<number>;
  delete(recordId: number): Promise<number>;
  deleteAll(): Promise<number>;
}
