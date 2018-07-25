import * as React from "react";
import { IMenuItemProps, IMenuItemState } from "./MenuItemType";
import cssModules from './MenuItems.scss';
import Tools from "../utils/Tools";
import Icon from "./Icon";

const tools = Tools.getInstance();

// todo checked mutiple
export default class MenuItem extends React.PureComponent<IMenuItemProps, IMenuItemState> {
    private static defaultProps: IMenuItemProps = {
        value: '',
        label: '',
        name: '',
        checked: false,
        multiSelect: false,
    };
    private clickedTimer: number;
    constructor(props: IMenuItemProps) {
        super(props);
        
        this.state = {
            clicked: false,
        };

        this.handleChange = this.handleChange.bind(this);
    }
    public render() {
        let { name, label, checked, multiSelect, className, style, icon } = this.props,
            { clicked } = this.state;

        return <div className={tools.classNames(cssModules.item, clicked ? cssModules['item-clicked'] : '', className)} style={style}>
            <label>
                {Icon.renderIcon(icon)}
                {label}
                <input className={cssModules['item-input']} type={multiSelect ? "checkbox" : "radio"} name={name} checked={checked} onChange={this.handleChange} />
            </label>
        </div>
    }
    public handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let {value, onChange } = this.props,
            checked = e.target.checked;

            this.setState({clicked: true});
            clearTimeout(this.clickedTimer);
            this.clickedTimer = window.setTimeout(() => this.setState({clicked: false}), 100);

        onChange && onChange({ checked, value });
    }
}