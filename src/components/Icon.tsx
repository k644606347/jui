import * as React from "react";
import Tools from "../utils/Tools";
import { CSSAttrs } from "../utils/types";
import iconCSS from './Icon.scss';
import { IconDefinition } from "./icons/SVGData";

const tools = Tools.getInstance();
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
export default class Icon extends React.PureComponent<IconProps, any> {
    static renderIcon(icon: React.ReactElement<IconProps> | IconDefinition) {
        return this.isIconElement(icon) ? icon : <Icon icon={icon} />;
    }
    static isIconElement(icon): icon is React.ReactElement<IconProps> {
        return React.isValidElement(icon) && icon.type === Icon;
    }
    constructor(props: IconProps) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
    }
    render() {
        let { icon, id, name, style, className, spin, pulse, flip } = this.props,
            classNames = tools.classNames(
                iconCSS.icon,
                spin && iconCSS.spin,
                pulse && iconCSS.pulse,
                flip && iconCSS['flip-' + flip],
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
