import * as React from 'react';
import { CSSAttrs } from '../utils/types';
import Icon, { IconDefinition } from './Icon';
import messageCSS from './Message.scss';
import { iconCloseCircleOutline, iconAlert, iconInfoCircleOutline, iconCheckCircleOutline } from './icons/SVGData';
import { tools } from '../utils/Tools';
import View from './View';
let cssModules = tools.useCSS(messageCSS);
interface Props extends CSSAttrs {
    type: 'error' | 'warn' | 'info' | 'success';
    showIcon?: boolean;
}

const iconMap: { [key in Props['type']]: IconDefinition } = {
    error: iconCloseCircleOutline,
    warn: iconAlert,
    info: iconInfoCircleOutline,
    success: iconCheckCircleOutline,
};
export default class Message extends React.PureComponent<Props> {
    static defaultProps = {
        showIcon: true,
    };

    render() {
        let { type, showIcon, children, style, className } = this.props;

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
