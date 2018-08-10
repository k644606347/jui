import { FieldData } from "./FieldType";
import Field from "./Field";

export type FormData = FieldData[];

export interface FormSubmitEvent {
    data: FormData;
}

export interface FormProps {
    onSubmit?: (e: any) => void;
    onChange?: (e: any) => void;
    // children: Field[];
    // action: string;
    // method: 'post' | 'get';
}