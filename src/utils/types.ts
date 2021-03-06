import { CSSProperties } from "react";

export type AnyObject = { [k in string | number | symbol]: any };
export type AnyFunction = (...args: any[]) => any;
export type NoResultFunction = (...args: any[]) => void;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export interface CSSAttrs {
    style?: CSSProperties;
    className?: string;
}
export const tuple = <T extends string[]>(...args: T) => args;