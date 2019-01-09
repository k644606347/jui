import { CheckboxItems, RadioItems, Input, Textarea } from "..";

// type CClass<P = FormWidgetProps> = React.ComponentClass<P>;
// type Props = CheckboxItemsProps & RadioItemsProps & InputProps;
export type FormWidgetName = 'checkboxItems' | 'radioItems' | 'text' | 'textarea';
export type FormWidgetClass =
    | typeof CheckboxItems
    | typeof RadioItems
    | typeof Input
    | typeof Textarea;
export type FormWidget = 
    | CheckboxItems
    | RadioItems
    | Input
    | Textarea;
export type FormWidgetConfig = {
    [key in FormWidgetName]: {
        class: FormWidgetClass;
    }
};
const Config = {
    checkboxItems: {
        class: CheckboxItems
    },
    radioItems: {
        class: RadioItems
    },
    text: {
        class: Input
    },
    textarea: {
        class: Textarea
    }
} as FormWidgetConfig;
export default Config;
