import * as React from 'react';
import { tools } from '../utils/Tools';
import inputCSS from './Input.scss';

let cssModules = tools.useCSS(inputCSS);
class Input extends React.PureComponent<React.InputHTMLAttributes<HTMLInputElement>> {
    render() {
        let { props } = this,
            {  className, style, ...restProps } = props;

        return (
            <input 
                {...restProps} 
                className={tools.classNames(cssModules.input, className)} type="text"/>
        );
    }
}
export default Input;