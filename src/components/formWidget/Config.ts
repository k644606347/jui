import CheckboxItems from "./CheckboxItems";
import RadioItems from "./RadioItems";
import InputWidget from './Input';
import TextareaWidget from "./Textarea";
import { FormWidgetProps } from "./Widget";

interface ConfigType {
    [k: string]: {
        widget: React.ComponentClass<FormWidgetProps>
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
} as ConfigType;