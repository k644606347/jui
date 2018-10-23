import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Transform,
    IconProp,
    FlipProp,
    SizeProp,
    PullProp,
    RotateProp,
    FaSymbol
} from "@fortawesome/fontawesome-svg-core";
import * as React from "react";
import Tools from "../utils/Tools";
import { CSSAttrs } from "../utils/types";

const tools = Tools.getInstance();
export interface IconProps extends CSSAttrs {
    icon: IconDefinition;
    mask?: IconProp;
    color?: string;
    spin?: boolean;
    pulse?: boolean;
    border?: boolean;
    fixedWidth?: boolean;
    inverse?: boolean;
    listItem?: boolean;
    flip?: FlipProp;
    size?: SizeProp;
    pull?: PullProp;
    rotation?: RotateProp;
    transform?: string | Transform;
    symbol?: FaSymbol;
    onClick?: (e: React.MouseEvent) => any;
}

export { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export default class Icon extends React.PureComponent<IconProps, any> {
    static renderIcon(icon: React.ReactElement<IconProps> | IconDefinition) {
        return this.isIconElement(icon) ? icon : <Icon icon={icon} />;
    }
    static isIconElement(icon: any): icon is React.ReactElement<IconProps> {
        return React.isValidElement(icon) && icon.type === Icon;
    }
    static isFontAweSomeIcon(icon: any) {
        let fasIcon = icon as IconDefinition;

        return (
            fasIcon.prefix && fasIcon.iconName && tools.isArray(fasIcon.icon)
        );
    }
    render() {
        let { onClick } = this.props;

        // TODO 不支持传入onClick
        return <FontAwesomeIcon {...this.props} />
    }
}
