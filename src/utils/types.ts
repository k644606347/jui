import { CSSProperties } from "react";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export interface CSSAttrs {
    style?: CSSProperties;
    className?: string;
}