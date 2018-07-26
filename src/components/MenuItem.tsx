import * as React from "react";
import { IMenuItemProps, IMenuItemState } from "./MenuItemType";
import cssModules from './MenuItems.scss';
import Tools from "../utils/Tools";
import Icon from "./Icon";
import Checkbox from "./Checkbox";
import { ChangeEvent } from "./CheckboxType";
import Radio from "./Radio";

const tools = Tools.getInstance();

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

        return <label className={tools.classNames(cssModules.item, clicked ? cssModules['item-clicked'] : '', className)} style={style}>
                <div className={cssModules['item-icon']}>{Icon.renderIcon(icon)}</div>
                <div className={cssModules['item-content']}>{label}</div>
                {
                    this.renderInputComponent()
                }
            </label>
    }
    private renderInputComponent() {
        let { multiSelect, name, value, checked } = this.props,
            propsConfig = {
                name,
                value,
                checked,
                onChange: this.handleChange,
            };

        return multiSelect ? <Checkbox {...propsConfig} /> : <Radio {...propsConfig} />;
    }

    // todo 目前Radio和Checkbox公用Checkbox下的ChangeEvent,后续需追加命名空间区别Radio和Checkbox下的ChangeEvent
    private handleChange(e: ChangeEvent) {
        let { value, onChange } = this.props,
            checked = e.checked;

            this.setState({clicked: true});
            clearTimeout(this.clickedTimer);
            this.clickedTimer = window.setTimeout(() => this.setState({clicked: false}), 100);

        onChange && onChange({ checked, value });
    }
}