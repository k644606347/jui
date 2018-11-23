import * as React from "react";
import Tools from "../utils/Tools";
import { CSSAttrs } from "../utils/types";
import { IconDefinition } from "./icons/IconDefinition";
import iconCSS from './Icon.scss';

const tools = Tools.getInstance();
export interface IconProps extends CSSAttrs {
    icon: IconDefinition;
    spin?: boolean;
    pulse?: boolean;
    flip?: "horizontal" | "vertical" | "both";
    rotation?: 90 | 180 | 270;
    onClick?: (e: React.MouseEvent) => any;
}
export { IconDefinition };
export default class Icon extends React.PureComponent<IconProps, any> {
    static renderIcon(icon: React.ReactElement<IconProps> | IconDefinition) {
        return this.isIconElement(icon) ? icon : <Icon icon={icon} />;
    }
    static isIconElement(icon: any): icon is React.ReactElement<IconProps> {
        return React.isValidElement(icon) && icon.type === Icon;
    }
    constructor(props: IconProps) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
    }
    render() {
        let { icon, className, spin, pulse, flip } = this.props,
            classNames = tools.classNames(
                iconCSS.icon,
                spin && iconCSS.spin,
                pulse && iconCSS.pulse,
                flip && iconCSS['flip-' + flip],
                className
            );

        return <svg className={classNames} viewBox={icon.viewBox} onClick={this.handleClick}>
            {
                icon.paths.map((path, i) => <path fill='currentColor' key={i} d={path} />)
            }
        </svg>
    }
    handleClick(e: React.MouseEvent) {
        let { onClick } = this.props;

        onClick && onClick(e);
    }
}
