import * as React from "react";
import { Omit } from "../utils/types";
import { InputChangeEvent } from "./PureInput";
import Tools from "../utils/Tools";
import cm from './PureTextarea.scss';

interface Props extends Omit<React.InputHTMLAttributes<HTMLTextAreaElement>, 'onChange'>{
    onChange?: (e: InputChangeEvent) => void;

}
interface State {}

const tools = Tools.getInstance();
export default class PureTextarea extends React.PureComponent<Props, State> {
    render() {
        let { className, ...restProps } = this.props;

        return <textarea {...restProps} className={tools.classNames(cm.wrapper, className)} onChange={this.handleChange} />
    }
    handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let { id = '', name = '', disabled = false, readOnly = false, onChange } = this.props,
            { value } = e.target;

        onChange && onChange({
            id, name, disabled, readOnly, value
        });
    }
}