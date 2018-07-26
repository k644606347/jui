
import { CheckboxProps } from './CheckboxType';
import * as React from 'react';
import cssModules from './Checkbox.scss';
import Tools from '../utils/Tools';
import { iconCheck_solid, iconCheckCircle_solid, iconCheckCircle_regular, iconCircle_regular } from './icons/FontAwesomeMap';
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

        return (
            <label style={style} className={tools.classNames(cssModules.wrapper, checked ? cssModules.checked : '', disabled ? cssModules.disabled : '', className)}>
                    <input className={tools.classNames(cssModules.input)} type="checkbox" name={name} value={value}
                     checked={checked} disabled={disabled} onChange={this.handleChange}/>
                <div className={cssModules.icon}><Icon icon={disabled ? iconCheckCircle_regular : checked ? iconCheckCircle_solid : iconCircle_regular} /></div>
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