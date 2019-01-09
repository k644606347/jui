import CheckboxItems, { CheckboxItemsProps } from "./CheckboxItems";
import RadioItems, { RadioItemsProps } from "./RadioItems";
import InputWidget, { InputProps } from "./Input";
import TextareaWidget from "./Textarea";
import { FormWidgetProps } from "./Widget";
import * as React from "react";

// type CClass<P = FormWidgetProps> = React.ComponentClass<P>;
// type Props = CheckboxItemsProps & RadioItemsProps & InputProps;
export type FormWidgetName = 'checkboxItems' | 'radioItems' | 'text' | 'textarea';
export type FormWidgetClass =
    | typeof CheckboxItems
    | typeof RadioItems
    | typeof InputWidget
    | typeof TextareaWidget;
export type FormWidget = 
    | CheckboxItems
    | RadioItems
    | InputWidget
    | TextareaWidget;
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
        class: InputWidget
    },
    textarea: {
        class: TextareaWidget
    }
} as FormWidgetConfig;
export default Config;

let isWidgetElement = <P = FormWidgetProps>(el: any): el is React.ComponentElement<P, React.Component<P>> => {
    if (!React.isValidElement(el)) {
        return false;
    }
    for (let widgetName in Config) {
        if (el.type === Config[widgetName].class) {
            return true;
        }
    }
    return false;
};
export { isWidgetElement };
