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
import styled from "styled-components";
import hoistNonReactStatics from "../utils/hoistNonReactStatics";

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
}

export { IconDefinition } from "@fortawesome/fontawesome-svg-core";

class Icon extends React.PureComponent<IconProps, any> {
    static renderIcon(icon: React.ReactElement<IconProps> | IconDefinition) {
        return this.isIconElement(icon) ? icon : <Styled icon={icon} />;
    }
    static isIconElement(icon: any): icon is React.ReactElement<IconProps> {
        return React.isValidElement(icon) && icon.type === Styled;
    }
    static isFontAweSomeIcon(icon: any) {
        let fasIcon = icon as IconDefinition;

        return (
            fasIcon.prefix && fasIcon.iconName && tools.isArray(fasIcon.icon)
        );
    }
    constructor(props: IconProps) {
        super(props);
    }
    public render() {
        return <FontAwesomeIcon {...this.props} />;
    }
}
const Styled = styled(Icon)``;
export default hoistNonReactStatics(Styled, Icon);
