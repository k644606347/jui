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
        // this.handleClick = this.handleClick.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
    }
    public render() {
        let { name, label, checked, multiSelect, className, style, icon } = this.props,
            { clicked } = this.state;

            // todo label后的div的touchstart会触发label, 应考虑使用div + touchstart 替代 label
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
    // todo touchstart and touchend event
    // private handleClick(e: React.MouseEvent<HTMLElement>) {
    //     let { value, onChange } = this.props,
    //         checked = e.checked;

    //         this.setState({clicked: true});
    //         clearTimeout(this.clickedTimer);
    //         this.clickedTimer = window.setTimeout(() => this.setState({clicked: false}), 100);

    //     onChange && onChange({ checked, value });
    // }
    // private buildEvents() {
    //     if (tools.supportTouchEvents()) {
    //         return {
    //             onTouchStart: this.handleTouchStart,
    //             onTouchEnd: this.handleTouchEnd,
    //         };
    //     } else {
    //         // 兼容pc端
    //         return {
    //             onClick: this.handleClick,
    //         }
    //     }
    // }
    private handleTouchStart(e: React.TouchEvent<HTMLElement>) {
        this.setState({clicked: true});
        // this.fireChangeCallback();
    }
    private handleTouchEnd(e: React.TouchEvent<HTMLElement>) {
        this.setState({clicked: false});
    }
    // private fireChangeCallback(options?: any) {
    //     let { id, onChange } = this.props;

    //     onChange && onChange({ id });
    // }
}