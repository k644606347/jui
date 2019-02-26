import * as React from 'react';
import { CSSAttrs } from '../utils/types';
import Icon, { IconDefinition } from './Icon';
import messageCSS from './Message.scss';
import { iconCloseCircleOutline, iconAlert, iconInfoCircleOutline } from './icons/SVGData';
import { tools } from '../utils/Tools';
import View from './View';

interface Props extends CSSAttrs {
    type: 'error' | 'warn' | 'info';
    showIcon?: boolean;
}

const iconMap: { [key in Props['type']]: IconDefinition } = {
    error: iconCloseCircleOutline,
    warn: iconAlert,
    info: iconInfoCircleOutline
};
export default class Message extends View<Props> {
    static defaultProps = {
        showIcon: true,
    };
    cssObject = messageCSS;
    render() {
        let { type, showIcon, children, style, className } = this.props,
            cssModules = this.cssModules;

        return (
            <div
                style={style}
                className={tools.classNames(cssModules.wrapper, cssModules[type], className)}
            >
                { showIcon && iconMap[type] ? <div className={cssModules.icon}><Icon icon={iconMap[type]} /></div> : '' }
                <div className={cssModules.message}>{ children }</div>
            </div>
        );
    }
}
