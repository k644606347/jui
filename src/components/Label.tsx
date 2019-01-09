import * as React from "react";
import Tools from "../utils/Tools";
import Log from "../utils/Log";
import cssModules from './Label.scss';

export interface LabelProps extends React.HTMLProps<HTMLLabelElement> {
    forRef?: React.RefObject<any>;
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
        let { required, children, forRef, className, onClick, ...restProps } = this.props;

        return (
            <label {...restProps} className={
                tools.classNames(cssModules.wrapper, required && cssModules.required, className)
            } onClick={this.handleLabelClick}>{children}</label>
        )
    }
    handleLabelClick(e: React.MouseEvent<HTMLLabelElement>) {
        let { onClick, forRef } = this.props;

        onClick && onClick(e);
    //
        if (forRef && forRef.current) {
            if (!tools.isFunction(forRef.current.focus)) {
                Log.warn('forRef.current缺少focus方法，无法触发focus行为');
                return;
            }
            forRef.current.focus();
        }
    }
}
