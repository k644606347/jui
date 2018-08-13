import { RadioProps } from "./RadioType";
import { CheckboxProps } from "./CheckboxType";
import { FieldRule } from "./FieldRules";
import { CSSProperties } from "../../node_modules/@types/react";

export interface FieldData {
    name: string;
    value: string;
}
export type FormWidget = React.ReactElement<CheckboxProps | RadioProps>;
export interface FieldProps {
    label: string | JSX.Element;
    widget: FormWidget;
    renderWidget?: (widget: FormWidget) => React.ReactNode;
    rules?: FieldRule[];
    style?: CSSProperties;
    className?: string;
    onChange?: (e: any) => void;
    onValueChange?: () => void;
    onFieldsChange?: () => void;
}