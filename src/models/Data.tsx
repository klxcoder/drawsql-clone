export abstract class Data<T> {

  public abstract getData(): T;

  public abstract setData(data: T): void;

  constructor() {
  }
}
