import * as React from 'react';
import { CSSAttrs } from '../utils/types';
import Tools from '../utils/Tools';
import cm from './Message.scss';
import { IconDefinition } from './Icon';
import {
    iconStop,
    iconTimesCircle,
    iconExclamationCircle,
    iconInfoCircle
} from './icons/FontAwesomeMap';
import { Icon } from '../App';

interface Props extends CSSAttrs {
    type: 'error' | 'warn' | 'info';
    showIcon?: boolean;
}

const tools = Tools.getInstance();
const iconMap: { [key in Props['type']]: IconDefinition } = {
    error: iconTimesCircle,
    warn: iconExclamationCircle,
    info: iconInfoCircle
};
export default class Message extends React.PureComponent<Props, any> {
    static defaultProps: Partial<Props> = {
        type: 'info',
        showIcon: false
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
