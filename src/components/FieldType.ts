import { CSSAttrs } from "../utils/types";
export interface FieldProps extends CSSAttrs {
    widget: JSX.Element | string;
    label?: JSX.Element | string;
    renderWidget?: (widget: React.ReactElement<any>) => React.ReactNode;
    render?: (widget: React.ReactElement<any>, label?: JSX.Element | string) => React.ReactNode;
    widgetProps?: any;
}