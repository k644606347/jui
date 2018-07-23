import * as React from "react";
import { IMenuItemProps } from "./MenuItemType";
import cssModules from './Menu.scss';
import Tools from "../utils/Tools";
import Icon, { iconChevronRight_solid, IconProps, IconDefinition } from "./Icon";

const tools = Tools.getInstance();

// todo checked mutiple
export default class MenuItem extends React.PureComponent<IMenuItemProps> {
    private static defaultProps: IMenuItemProps = {
        name: tools.genID(),
        label: '',
        checked: false,
    };
    constructor(props: IMenuItemProps) {
        super(props);
        
        this.handleChange = this.handleChange.bind(this);
    }
    public render() {
        let { className, style, name, label, checked, active, icon } = this.props;

        return <div className={tools.classNames(cssModules['menu-item'], active && cssModules['active-item'], className)} style={style}>
            <label>
                {Icon.renderIcon(icon)}
                {label}<input type="checkbox" name={name} checked={checked} hidden={true} onChange={this.handleChange} />
            </label>
        </div>
    }
    public handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { name, onChange } = this.props,
            checked = e.target.checked;

        onChange && onChange({ name, checked: checked});
    }
}