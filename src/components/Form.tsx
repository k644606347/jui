import * as React from 'react';
import { FormProps, FormState } from './FormType';
import Tools from '../utils/Tools';
import cm from './Form.scss';

const tools = Tools.getInstance();
export default class Form extends React.PureComponent<FormProps, FormState> {
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
