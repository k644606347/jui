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
import { CSSProperties } from 'react';
export interface IconProps {
    icon: IconDefinition
    mask?: IconProp
    className?: string
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
    style?: CSSProperties
}

export * from './icons/FontAwesomeMap';

export { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export default class Icon extends React.PureComponent<IconProps, any> {
    public static renderIcon(icon: React.ReactElement<IconProps> | IconDefinition | undefined) {
        if (icon) {
            if (Icon.isIconComponent(icon)) {
                return icon;
            } else {
                return <Icon icon={icon as IconDefinition} />
            }
        } else {
            return '';
        }
    }
    public static isIconComponent(icon: any) {
        return (icon as React.ReactElement<IconProps>).type === Icon;
    }
    constructor(props: IconProps) {
        super(props);
    }
    public render() {
        let { icon, style, className, size, spin, border, inverse, flip, pulse, rotation, transform } = this.props;

        return <FontAwesomeIcon icon={icon} style={style} className={className} size={size} spin={spin} border={border} inverse={inverse} flip={flip} pulse={pulse} rotation={rotation} transform={transform} />
    }
}