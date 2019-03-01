import * as React from "react";
import { tools } from "../utils/Tools";
import { CSSAttrs } from "../utils/types";
import iconCSS from './Icon.scss';
import { IconDefinition } from "./icons/SVGData";
import View from "./View";

const cssModules = tools.useCSS(iconCSS);
export interface IconProps extends CSSAttrs {
    icon: IconDefinition;
    spin?: boolean;
    pulse?: boolean;
    flip?: "horizontal" | "vertical" | "both";
    rotation?: 90 | 180 | 270;
    onClick?: (e: React.MouseEvent) => any;
    id?: string;
    name?: string;
}
export { IconDefinition };
export default class Icon extends View<IconProps> {
    static renderIcon(icon: React.ReactElement<IconProps> | IconDefinition) {
        return this.isIconElement(icon) ? icon : <Icon icon={icon} />;
    }
    static isIconElement(target): target is React.ReactElement<IconProps> {
        return React.isValidElement(target) && target.type === Icon;
    }
    cssObject = iconCSS;
    constructor(props: IconProps) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
    }
    render() {
        let { icon, id, name, style, className, spin, pulse, flip } = this.props,
            classNames = tools.classNames(
                cssModules.icon,
                spin && cssModules.spin,
                pulse && cssModules.pulse,
                flip && cssModules['flip-' + flip],
                className
            );

        return <svg id={id} name={name} icon-name={icon.name} style={style} className={classNames} viewBox={icon.viewBox} onClick={this.handleClick}>
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
