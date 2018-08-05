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
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    public render() {
        let { label, checked, className, style, icon } = this.props,
            { clicked } = this.state;

        return (
            <div className={
                tools.classNames(
                    cssModules.item, 
                    checked && cssModules['item-checked'],
                    clicked && cssModules['item-clicked'], 
                    className
                    )
                } style={style} {...this.buildEvents()}>
                {
                    icon && <div className={cssModules['item-icon']}>{Icon.renderIcon(icon)}</div>
                }
                <div className={cssModules['item-content']}>{label}</div>
                {
                    this.renderInputComponent()
                }
            </div>
        )
    }
    private buildEvents() {
        if (tools.supportTouchEvents()) {
            return {
                onTouchStart: this.handleTouchStart,
                onTouchEnd: this.handleTouchEnd,
            };
        } else {
            // 兼容pc端
            return {
                onClick: this.handleClick,
            }
        }
    }
    private renderInputComponent() {
        let { multiSelect, name, value, checked } = this.props,
            propsConfig = {
                name,
                value,
                checked,
                className: tools.classNames(cssModules['item-input'])
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
    private handleTouchStart(e: React.TouchEvent<HTMLElement>) {
        this.setState({clicked: true});
    }
    private handleTouchEnd(e: React.TouchEvent<HTMLElement>) {
        this.setState({clicked: false});
        this.fireChangeCallback({ checked: !this.props.checked });
    }
    private handleClick(e: React.MouseEvent<HTMLElement>) {
        this.setState({ clicked: true });
        clearTimeout(this.clickedTimer);
        this.clickedTimer = window.setTimeout(() => this.setState({ clicked: false }), 150);

        this.fireChangeCallback({ checked: !this.props.checked });
    }
    private fireChangeCallback(options?: any) {
        let { value, onChange } = this.props,
            { checked } = options;

        onChange && onChange({ checked, value });
    }
}