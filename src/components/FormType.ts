import { FieldProps } from "./FieldType";

// export type FormData = FieldData[];

// export interface FormSubmitEvent {
//     data: FormData;
// }

export interface FormProps {
    fields: FieldProps[];
    onSubmit?: (e: any) => void;
    onChange?: (e: any) => void;
    onValid?: () => void;
    onInvalid?: () => void;
    isValid?: boolean;
    // action: string;// TODO
    // method: 'post' | 'get';
}
export interface FormState {
    isValid?: boolean;
}