import * as React from 'react';
import { PresetIcons, ButtonProps } from './ButtonType';
import Icon, { IconProps } from './Icon';
import TouchFeedback from './TouchFeedback';
import Tools from '../utils/Tools';
import cssModule from './Button.scss';
import { iconCloud, iconCloudDownload, iconCloudUpload, iconDownload, iconLoading, iconPower, iconSearch, iconCheckCircle, iconCheckCircleOutline, iconTime, iconTimeOutline, iconMoreVertical, iconMore, iconArrowUp, iconArrowForward, iconArrowDown, iconArrowBack } from './icons/SVGData';

const tools = Tools.getInstance();
const prefixCls = 'btn';
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
class Button extends React.PureComponent<ButtonProps, any> {
    public static defaultProps = {
        disabled: false,
        icon: '',
        inline: false,
        loading: false,
        size: 'default',
    };
    constructor(props: ButtonProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    public render() {
        let { props } = this,
            { children, className, disabled, icon, inline, loading, shape, style, size, type } = props,
            presetIcon, iconElement;

        if (loading) {
            presetIcon = buttonIcons.loading;
        } else {
            if (icon) {
                if (typeof icon === 'string') {
                    presetIcon = buttonIcons[icon];
                } else {
                    iconElement = Icon.renderIcon(icon);
                }
            }
        }

        className = tools.classNames(
            cssModule.btn,
            [ type, disabled && 'disabled', inline && 'inline', size, shape ].map(
                n => cssModule[`${prefixCls}-${n}`]
            ),
            className
        );

        return (
            <TouchFeedback activeClassName={cssModule[`${prefixCls}-active`]} disabled={disabled}>
                <a style={style} className={className} onClick={this.handleClick}>
                    {
                        presetIcon ?  
                            <Icon icon={presetIcon} className={cssModule.icon} spin={loading} /> : 
                            iconElement ? 
                                React.cloneElement<IconProps>(
                                    iconElement, 
                                    {
                                        className: tools.classNames(cssModule.icon, iconElement.props.className),
                                    }
                                ) : null
                    }
                    {children !== undefined ? <span className={cssModule.content}>{children}</span> : null}
                </a>
            </TouchFeedback>
        );
    }

    public componentDidMount() {
        //
    }

    public handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        e.stopPropagation();

        let { props } = this,
            { onClick, disabled } = props;

        if (disabled) {
            return;
        }

        if (onClick) {
            onClick(e);
        }
    }
}

export default Button;