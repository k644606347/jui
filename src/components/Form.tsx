import * as React from 'react';
import Tools from '../utils/Tools';
import { CSSAttrs } from "../utils/types";
import formCSS from './Form.scss';

export interface FormProps extends CSSAttrs, React.FormHTMLAttributes<HTMLFormElement> {
    onSubmit?: (e: React.FormEvent) => void;
}
const tools = Tools.getInstance();
export default class Form extends React.PureComponent<FormProps> {
    constructor(props: FormProps) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    render() {
        let { props } = this,
            { children, style, className, ...restProps } = props;

        return (
            <form
                {...restProps}
                style={style}
                className={tools.classNames(
                    formCSS.wrapper,
                    className
                )}
                onSubmit={this.handleSubmit}
            >
                {children}
            </form>
        );
    }
    private handleSubmit(e: React.FormEvent) {
        let { onSubmit } = this.props;

        onSubmit && onSubmit(e);
    }
}
