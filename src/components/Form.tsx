import * as React from 'react';
import Tools, { tools } from '../utils/Tools';
import { CSSAttrs } from "../utils/types";
import formCSS from './Form.scss';
import View from './View';

let cssModules = tools.useCSS(formCSS);
export interface FormProps extends CSSAttrs, React.FormHTMLAttributes<HTMLFormElement> {
}
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
                    cssModules.wrapper,
                    className
                )}
                onSubmit={this.handleSubmit}
            >
                {children}
            </form>
        );
    }
    private handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        let { onSubmit } = this.props;

        onSubmit && onSubmit(e);
    }
}
