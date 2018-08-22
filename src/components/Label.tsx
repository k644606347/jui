import * as React from "react";
import cm from './Label.scss';
import Tools from "../utils/Tools";

interface Props extends React.HTMLProps<HTMLLabelElement> {}

const tools = Tools.getInstance();
export default function Label(props: Props): JSX.Element {
    let { children, className, ...restProps } = props;
    
    return <label {...restProps} className={tools.classNames(cm.wrapper, className)}>{ children }</label>
}
