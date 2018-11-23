import * as React from 'react';
import Tools from '../utils/Tools';
import { Omit } from '../utils/types';
import cm from './PureInput.scss';


export interface InputChangeEvent {
    id: string;
    name: string;
    value: any;
    disabled: boolean;
    readOnly: boolean;
}
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    onChange?: (e: InputChangeEvent) => void;
};
const tools = Tools.getInstance();
export default class PureInput extends React.PureComponent<InputProps> {
    constructor(props: InputProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { className, ...restProps } = this.props;

        return (
            <input
                {...restProps}
                className={
                    tools.classNames(cm.input, className)
                }
                onChange={this.handleChange}
            />
        );
    }
    protected handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { value } = e.target,
            { id, name, onChange, disabled, readOnly } = this.props;

        onChange && onChange({
            id: id || '',
            name: name || '',
            value,
            disabled: disabled || false,
            readOnly: readOnly || false,
        });
    }
}