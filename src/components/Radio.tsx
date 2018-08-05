
import { CheckboxProps } from './CheckboxType';
import * as React from 'react';
import cssModules from './Checkbox.scss';
import Tools from '../utils/Tools';
import { iconCheck } from './icons/FontAwesomeMap';
import Icon from './Icon';

const tools = Tools.getInstance();

class Checkbox extends React.PureComponent<CheckboxProps, any> {
    private static defaultProps = {
        name: '',
        value: '',
        checked: false,
        disabled: false,
    };
    constructor(props: CheckboxProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }
    public render() {
        let { name, value, style, className, children, checked, disabled } = this.props;

        // todo icon风格需优化
        return (
            <label style={style} className={
                tools.classNames(
                    cssModules.wrapper, 
                    checked && cssModules.checked, 
                    disabled && cssModules.disabled, 
                    className)
                }>
                    <input className={tools.classNames(cssModules.input)} type="checkbox" name={name} value={value}
                     checked={checked} disabled={disabled} onChange={this.handleChange}/>
                <div className={cssModules.icon}><Icon icon={iconCheck} /></div>
                {children !== undefined ? <div className={cssModules.description}>{children}</div> : ''}
            </label>
        );
    }
    private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { name, value, disabled, onChange } = this.props,
            { checked } = e.target;
            
        onChange && onChange({ name, value, checked, disabled: !!disabled });
    }
}
export default Checkbox;