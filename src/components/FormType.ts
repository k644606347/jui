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
    onSubmit?: (e: any) => void;
    onChange?: (e: any) => void;
    // children: Field[];
    // action: string;
    // method: 'post' | 'get';
}