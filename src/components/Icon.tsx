import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Transform,
    IconProp,
    FlipProp,
    SizeProp,
    PullProp,
    RotateProp,
    FaSymbol
} from '@fortawesome/fontawesome-svg-core'
import * as React from 'react';
import Tools from '../utils/Tools';
import { CSSAttrs } from '../utils/types';

const tools = Tools.getInstance();
export interface IconProps extends CSSAttrs {
    icon: IconDefinition
    mask?: IconProp
    color?: string
    spin?: boolean
    pulse?: boolean
    border?: boolean
    fixedWidth?: boolean
    inverse?: boolean
    listItem?: boolean
    flip?: FlipProp
    size?: SizeProp
    pull?: PullProp
    rotation?: RotateProp
    transform?: string | Transform
    symbol?: FaSymbol
};

export { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export default class Icon extends React.PureComponent<IconProps, any> {
    public static renderIcon(icon: React.ReactElement<IconProps> | IconDefinition) {
        if (Icon.isIconElement(icon)) {
            return icon as React.ReactElement<IconProps>;
        } else {
            return <Icon icon={icon as IconDefinition} />
        }
    }
    public static isIconElement(icon: any) {
        return (icon as React.ReactElement<IconProps>).type === Icon;
    }
    public static isFontAweSomeIcon(icon: any) {
        let fasIcon = (icon as IconDefinition);

        return fasIcon.prefix && fasIcon.iconName && tools.isArray(fasIcon.icon);
    }
    constructor(props: IconProps) {
        super(props);
    }
    public render() {
        return <FontAwesomeIcon {...this.props} />
    }
}