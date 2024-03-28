export interface IBaseModel<T> {
  save(tutorial: T): Promise<T>;
  retrieveAll(searchParams: { title: string; published: boolean }): Promise<T[]>;
  retrieveById(tutorialId: number): Promise<T | undefined>;
  update(tutorial: T): Promise<number>;
  delete(tutorialId: number): Promise<number>;
  deleteAll(): Promise<number>;
}
