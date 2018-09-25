import { CSSAttrs } from "../utils/types";

export interface FormProps extends CSSAttrs {
    onSubmit?: (e: React.FormEvent) => void;
    isValid?: boolean;
    // action: string;// TODO
    // method: 'post' | 'get';
}
export interface FormState {}