import * as React from 'react';
import Tools from '../utils/Tools';
import { CSSAttrs } from "../utils/types";
import cm from './Form.scss';

export interface FormProps extends CSSAttrs, React.FormHTMLAttributes<HTMLFormElement> {
    onSubmit?: (e: React.FormEvent) => void;
    isValid?: boolean;
}
const tools = Tools.getInstance();
export default class Form extends React.PureComponent<FormProps, any> {
    static defaultProps: Partial<FormProps> = {
        isValid: true
    };
    constructor(props: FormProps) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }
    render() {
        let { props } = this,
            { children, isValid } = props;

        return (
            <form
                className={tools.classNames(cm.wrapper, isValid && cm.isValid)}
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
