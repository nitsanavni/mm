export type Callback<T> = (t: T) => void;
export type CB<T> = Callback<T>;
export type Provide<T> = CB<CB<T>>;
