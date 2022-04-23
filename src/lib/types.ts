export type primitive = number | string | boolean | symbol | bigint;
export type Maybe<T> = T | null | undefined;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type NonOptional<T> = T extends undefined ? never : T;

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * A type-safe creator of tuple.
 * @param args values for the future tuple
 */
export function t<A>(...args: [A]): [A];
export function t<A, B>(...args: [A, B]): [A, B];
export function t<A, B, C>(...args: [A, B, C]): [A, B, C];
export function t(...args: any[]): any[] {
  return args;
}

export function as<T>(value: any): value is T {
  return true;
}
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function cast<T>(value: any): asserts value is T {}

export interface AsyncInitializable {
  init(): Promise<void>;
}

export interface Disposable {
  dispose(): Promise<void>;
}
