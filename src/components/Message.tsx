import * as React from 'react';
import { CSSAttrs } from '../utils/types';
import Tools from '../utils/Tools';
import Icon, { IconDefinition } from './Icon';
import cm from './Message.scss';
import { iconCloseCircleOutline, iconAlert, iconInfoCircleOutline } from './icons/SVGData';

interface Props extends CSSAttrs {
    type: 'error' | 'warn' | 'info';
    showIcon?: boolean;
}

const tools = Tools.getInstance();
const iconMap: { [key in Props['type']]: IconDefinition } = {
    error: iconCloseCircleOutline,
    warn: iconAlert,
    info: iconInfoCircleOutline
};
export default class Message extends React.PureComponent<Props, any> {
    static defaultProps: Partial<Props> = {
        type: 'info',
        showIcon: true,
    };
    render() {
        let { type, showIcon, children, style, className } = this.props;

        return (
            <div
                style={style}
                className={tools.classNames(cm.wrapper, cm[type], className)}
            >
                { showIcon && iconMap[type] ? <Icon className={cm.icon} icon={iconMap[type]} /> : '' }
                <div className={cm.message}>{ children }</div>
            </div>
        );
    }
}
