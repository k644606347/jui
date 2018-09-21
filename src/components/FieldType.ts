import { CSSAttrs } from "../utils/types";
import { FormWidgetProps } from "./formWidget/Widget";

export interface FieldProps extends CSSAttrs {
    widget: string;
    label?: JSX.Element | string;
    renderWidget?: (widget: React.ReactElement<any>) => React.ReactNode;
    render?: (widget: React.ReactElement<any>, label?: JSX.Element | string) => React.ReactNode;
    widgetProps?: { [key in keyof FormWidgetProps | any]?: any };
}