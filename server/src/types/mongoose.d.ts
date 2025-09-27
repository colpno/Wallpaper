declare module "mongoose" {
  export type FilterCondition<T> = T | QuerySelector<T>;

  export type Filter<T> = {
    [P in keyof T]?: FilterCondition<T[P]>;
  } & RootQuerySelector<T> & { _id?: FilterCondition<string> };
}
