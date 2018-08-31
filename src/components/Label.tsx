import * as React from "react";
import cm from './Label.scss';
import Tools from "../utils/Tools";

interface Props extends React.HTMLProps<HTMLLabelElement> {
    forRef?: React.RefObject<any>;
    onClick?: (e: React.MouseEvent<HTMLLabelElement>) => void;
    required?: boolean;
}

const tools = Tools.getInstance();
export default function Label(props: Props): JSX.Element {
    let { required, children, forRef, className, onClick, ...restProps } = props;

    return (
        <label {...restProps} className={
            tools.classNames(cm.wrapper, cm.required, className)
        } onClick={
            (e: React.MouseEvent<HTMLLabelElement>) => {
                onClick && onClick(e);

                if (forRef && forRef.current && tools.isFunction(forRef.current.focus)) {
                    forRef.current.focus();
                }
            }
        }>{children}</label>
    )
}
