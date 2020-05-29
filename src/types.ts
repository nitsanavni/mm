export type Callback<T> = (t: T) => any;
export type CB<T> = Callback<T>;
export type Provide<T> = CB<CB<T>>;
