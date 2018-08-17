import { RadioProps } from "./RadioType";
import { CheckboxProps } from "./CheckboxType";
import { FieldRule } from "./FieldRules";
import Checkbox from "./Checkbox";
import Radio from "./Radio";
import Input from "./Input";
import { CSSAttrs } from "../utils/types";
import { InputProps } from "./InputType";

export interface FieldData {
    name: string;
    value: string;
}
type WidgetElementType = React.ReactElement<CheckboxProps | RadioProps | InputProps>;
type OptionsWidget = React.ReactElement<CheckboxProps | RadioProps>;
const FormWidgetMap = {
    checkbox: Checkbox,
    radio: Radio,
    input: Input,
};
export {
    FormWidgetMap
};
export interface FieldProps extends CSSAttrs {
    name: string;
    label?: React.ReactNode;
    widget: string;
    renderWidget: (widget: JSX.Element) => React.ReactNode;
    value?: any;
    options?: [{name: string, value: string}];
    placeholder?: string;
    rules?: FieldRule[];
    onChange?: (e: any) => void;
}