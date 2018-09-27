import * as React from "react";
import { Omit } from "../utils/types";
import { InputChangeEvent } from "./Input";
import cm from './Textarea.scss';
import Tools from "../utils/Tools";

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>{
    onChange?: (e: InputChangeEvent) => void;

}
interface State {}

const tools = Tools.getInstance();
export default class Textarea extends React.PureComponent<Props, State> {
    render() {
        let { className } = this.props;

        return <textarea className={tools.classNames(cm.wrapper, className)} onChange={this.handleChange} />
    }
    handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let { id = '', name = '', disabled = false, readOnly = false, onChange } = this.props,
            { value } = e.target;

        onChange && onChange({
            id, name, disabled, readOnly, value
        });
    }
}