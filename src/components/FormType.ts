import Field from "./Field";
import Checkbox from "./formWidget/Checkbox";
import CheckboxItems from "./formWidget/CheckboxItems";
import Radio from "./formWidget/Radio";
import RadioItems from "./formWidget/RadioItems";
import Input from "./formWidget/Input";
import { FieldProps } from "./FieldType";

// export type FormData = FieldData[];

// export interface FormSubmitEvent {
//     data: FormData;
// }

export interface FormProps {
    fields?: FieldProps[];
    onSubmit?: () => void;
    onChange?: (e: any) => void;
    onValid?: () => void;
    onInvalid?: () => void;
    isValid?: boolean;
    // children: Field[];
    // action: string;
    // method: 'post' | 'get';
}
export interface FormState {
    isValid?: boolean;
    value?: Array<{
        name: string;
        value: any;
    }>
}