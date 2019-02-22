import * as React from "react";
import Tools from "../utils/Tools";
import labelCSS from './Label.scss';

export interface LabelProps extends React.HTMLProps<HTMLLabelElement> {
    onClick?: (e: React.MouseEvent<HTMLLabelElement>) => void;
    required?: boolean;
}

const tools = Tools.getInstance();
export default class Label extends React.PureComponent<LabelProps> {
    static isLabelElement(el: any): el is React.ReactElement<LabelProps> {
        return React.isValidElement(el) && el.type === Label;
    }
    constructor(props: LabelProps) {
        super(props);

        this.handleLabelClick = this.handleLabelClick.bind(this);
    }
    render() {
        let { required, children, className, onClick, ...restProps } = this.props;

        return (
            <label {...restProps} className={
                tools.classNames(labelCSS.wrapper, required && labelCSS.required, className)
            } onClick={this.handleLabelClick}>{children}</label>
        )
    }
    handleLabelClick(e: React.MouseEvent<HTMLLabelElement>) {
        let { onClick } = this.props;
        onClick && onClick(e);
    }
}
