import * as React from 'react';
import { PresetIcons, ButtonProps } from './ButtonType';
import cssModule from './Button.scss';
import Icon, { IconProps } from './Icon';
import TouchFeedback from './TouchFeedback';
import Tools from '../utils/Tools';
import { 
    iconCloud, iconCloudDownloadAlt, 
    iconDownload, iconCloudUploadAlt, 
    iconPowerOff, iconSpinner, 
    iconSearch, iconCheckCircle, 
    iconCheckCircle_r, iconTimesCircle, 
    iconTimesCircle_r, iconEllipsisH, 
    iconEllipsisV, iconChevronUp, 
    iconChevronRight, iconChevronDown, 
    iconChevronLeft 
} from './icons/FontAwesomeMap';

const tools = Tools.getInstance();
const prefixCls = 'btn';
const buttonIcons: PresetIcons = {
    cloud: iconCloud,
    'cloud-down': iconCloudDownloadAlt,
    'cloud-upload': iconCloudUploadAlt,
    download: iconDownload,
    loading: iconSpinner,
    'power-off': iconPowerOff,
    search: iconSearch,
    'check-circle': iconCheckCircle,
    'check-circle-o': iconCheckCircle_r,
    'times-circle': iconTimesCircle,
    'times-circle-o': iconTimesCircle_r,
    'ellipsis-h': iconEllipsisH,
    'ellipsis-v': iconEllipsisV,
    'up': iconChevronUp,
    'right': iconChevronRight,
    'down': iconChevronDown,
    'left': iconChevronLeft,
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
                    {children !== undefined ? <React.Fragment><span>{children}</span></React.Fragment> : null}
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