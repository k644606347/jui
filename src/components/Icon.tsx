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
import { IconGroup } from './icons/IconGroup';
export interface IProps {
  icon: IconGroup
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
export * from './icons/FasIconPack';

export default function Icon(props: IProps): JSX.Element{
    let { icon, style, className, size, spin, border, flip, pulse, rotation, transform } = props;
    return <FontAwesomeIcon icon={icon.default} style={style} className={className} size={size} spin={spin} border={border} flip={flip} pulse={pulse} rotation={rotation} transform={transform}/>
}