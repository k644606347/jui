import * as React from 'react';
import Icon, { IconProps } from './Icon';
import TouchFeedback from './TouchFeedback';
import { tools } from '../utils/Tools';
import buttonCSS from './Button.scss';
import { iconCloud, iconCloudDownload, iconCloudUpload, iconDownload, iconLoading, iconPower, iconSearch, iconCheckCircle, iconCheckCircleOutline, iconTime, iconTimeOutline, iconMoreVertical, iconMore, iconArrowUp, iconArrowForward, iconArrowDown, iconArrowBack, IconDefinition } from './icons/SVGData';
import View from './View';

export interface PresetIcons {
    cloud: IconDefinition;
    'cloud-down': IconDefinition;
    'cloud-upload': IconDefinition;
    download: IconDefinition;
    loading: IconDefinition;
    'power-off': IconDefinition;
    search: IconDefinition;
    'check-circle': IconDefinition;
    'check-circle-o': IconDefinition;
    'time-circle': IconDefinition;
    'time-circle-o': IconDefinition;
    more: IconDefinition;
    'more-v': IconDefinition;
    up: IconDefinition;
    right: IconDefinition;
    down: IconDefinition;
    left: IconDefinition;
}

type ButtonType = 'primary' | 'default' | 'danger';
type IconType = keyof PresetIcons;
type SizeType = 'small' | 'default' | 'large';
type ShapeType = 'default' |'circle';

export interface ButtonProps {
    className?: string;
    activeClassName?: string;
    style?: React.CSSProperties;
    title?: string;
    type?: ButtonType;
    size?: SizeType;
    disabled?: boolean;
    icon?: IconType | IconDefinition | React.ReactElement<IconProps>;
    loading?: boolean;
    strong?: boolean;
    block?: boolean;
    full?: boolean;
    shape?: ShapeType;
    outline?: boolean;
    clear?: boolean;
    onClick?: React.MouseEventHandler;
}

const buttonIcons: PresetIcons = {
    cloud: iconCloud,
    'cloud-down': iconCloudDownload,
    'cloud-upload': iconCloudUpload,
    download: iconDownload,
    loading: iconLoading,
    'power-off': iconPower,
    search: iconSearch,
    'check-circle': iconCheckCircle,
    'check-circle-o': iconCheckCircleOutline,
    'time-circle': iconTime,
    'time-circle-o': iconTimeOutline,
    'more': iconMore,
    'more-v': iconMoreVertical,
    'up': iconArrowUp,
    'right': iconArrowForward,
    'down': iconArrowDown,
    'left': iconArrowBack,
};
class Button extends View<ButtonProps> {
    static defaultProps: ButtonProps = {
        disabled: false,
        block: false,
        full: false,
        loading: false,
        type: 'default',
        size: 'default',
        shape: 'default',
    };
    cssObject = buttonCSS;
    constructor(props: ButtonProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        let { props } = this,
            { children, className, activeClassName, title, disabled, icon, outline, clear, strong, 
                block, full, loading, shape, style, size, type: type } = props,
            iconDefinition, iconElement,
            cssModules = this.cssModules;

        if (loading) {
            iconDefinition = buttonIcons.loading;
        } else {
            if (icon) {
                if (typeof icon === 'string') {
                    iconDefinition = buttonIcons[icon];
                } else {
                    iconElement = Icon.renderIcon(icon);
                }
            }
        }

        let btnClassName = tools.classNames(
            cssModules.btn,
            [ type, 
                disabled && 'disabled', 
                outline && 'outline', 
                clear && 'clear', 
                strong && 'strong',
                block && 'block', 
                full && 'full', 
                size, shape ].map(
                n => n && cssModules[n]
            ),
            className
        );

        return (
            <TouchFeedback activeClassName={tools.classNames(cssModules.active, activeClassName)} disabled={disabled}>
                <a title={title} style={style} className={btnClassName} onClick={this.handleClick}>
                    <span className={cssModules.control}>
                        {
                            iconDefinition ?  
                                <Icon icon={iconDefinition} className={cssModules.icon} spin={loading} /> 
                                : iconElement ? 
                                    React.cloneElement(
                                        iconElement, 
                                        {
                                            className: tools.classNames(cssModules.icon, iconElement.props.className),
                                        }
                                    ) : ''
                        }
                        {children ? <span className={cssModules.content}>{children}</span> : ''}
                    </span>
                </a>
            </TouchFeedback>
        );
    }

    handleClick(e) {
        let { props } = this,
            { onClick, disabled } = props;

        if (disabled) {
            return;
        }

        onClick && onClick(e);
    }
}

export default Button;