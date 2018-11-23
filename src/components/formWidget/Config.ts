import CheckboxItems from "./CheckboxItems";
import RadioItems from "./RadioItems";
import InputWidget from './Input';
import TextareaWidget from "./Textarea";
import { FormWidgetProps } from "./Widget";

export type FormWidgetName = 'checkboxItems' | 'radioItems' | 'text' | 'textarea';
export type FormWidgetConfig =  {
    [key in FormWidgetName]: {
        widget: React.ComponentClass<FormWidgetProps> | React.ForwardRefExoticComponent<FormWidgetProps>
    }
}
export default {
    checkboxItems: {
        widget: CheckboxItems
    },
    radioItems: {
        widget: RadioItems
    },
    text: {
        widget: InputWidget
    },
    textarea: {
        widget: TextareaWidget,
    }
} as FormWidgetConfig;