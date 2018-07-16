import { MouseEventHandler } from 'react';
import * as React from 'react';
import cssModule from './Button.scss';
import Icon, { IconDefinition, iconCloud_solid, iconCloudDownloadAlt_solid, iconDownload_solid, iconCloudUploadAlt_solid, iconPowerOff_solid, iconSpinner_solid, iconSearch_solid, iconCheckCircle_solid, iconCheckCircle_regular, iconTimesCircle_solid, iconTimesCircle_regular } from './Icon';
import TouchFeedback from './TouchFeedback';
import Tools from '../utils/Tools';
import { iconEllipsisH_solid, iconEllipsisV_solid, iconChevronUp_solid, iconChevronRight_solid, iconChevronDown_solid, iconChevronLeft_solid } from './icons/FontAwesomeMap';

const tools = Tools.getInstace();
const prefixCls = 'btn';
interface IButtonIcons {
    cloud: IconDefinition;
    'cloud-down': IconDefinition;
    'cloud-upload': IconDefinition;
    download: IconDefinition;
    loading: IconDefinition;
    'power-off': IconDefinition;
    search: IconDefinition;
    'check-circle': IconDefinition;
    'check-circle-o': IconDefinition;
    'times-circle': IconDefinition;
    'times-circle-o': IconDefinition;
    'ellipsis-h': IconDefinition;
    'ellipsis-v': IconDefinition;
    'up': IconDefinition;
    'right': IconDefinition;
    'down': IconDefinition;
    'left': IconDefinition;
}
const buttonIcons: IButtonIcons = {
    cloud: iconCloud_solid,
    'cloud-down': iconCloudDownloadAlt_solid,
    'cloud-upload': iconCloudUploadAlt_solid,
    download: iconDownload_solid,
    loading: iconSpinner_solid,
    'power-off': iconPowerOff_solid,
    search: iconSearch_solid,
    'check-circle': iconCheckCircle_solid,
    'check-circle-o': iconCheckCircle_regular,
    'times-circle': iconTimesCircle_solid,
    'times-circle-o': iconTimesCircle_regular,
    'ellipsis-h': iconEllipsisH_solid,
    'ellipsis-v': iconEllipsisV_solid,
    'up': iconChevronUp_solid,
    'right': iconChevronRight_solid,
    'down': iconChevronDown_solid,
    'left': iconChevronLeft_solid,
};

type IconType = keyof IButtonIcons;
type SizeType = 'small' | 'default' | 'large';
type ShapeType = 'circle';
type ButtonType = 'primary' | 'dashed' | 'warning';
export interface IButtonProps {
    className?: string;
    activeClassName?: string;
    inline?: boolean;
    type?: ButtonType;
    size?: SizeType;
    icon?: IconType | JSX.Element;
    shape?: ShapeType;
    disabled?: boolean;
    loading?: boolean;
    style?: React.CSSProperties;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
}
class Button extends React.PureComponent<IButtonProps> {
    public static defaultProps = {
        disabled: false,
        icon: '',
        inline: false,
        loading: false,
        size: 'default',
    };
    constructor(props: IButtonProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    public render() {
        let { props } = this,
            { children, className, disabled, icon, inline, loading, shape, style, size, type } = props,
            iconEntity, iconElement;

        if (loading) {
            iconEntity = buttonIcons.loading;
        } else {
            if (icon) {
                if (typeof icon === 'string') {
                    iconEntity = buttonIcons[icon];
                } else {
                    iconElement = icon;
                }
            }
        }

        className = tools.classNames(cssModule.btn, [type, disabled && 'disabled', inline && 'inline', size, shape].map(n => cssModule[`${prefixCls}-${n}`]), className);

        return (
            <TouchFeedback activeClassName={cssModule[`${prefixCls}-active`]} disabled={disabled}>
                <a style={style} className={className} onClick={this.handleClick}>
                    {iconEntity ? <Icon icon={iconEntity} className={cssModule[`${prefixCls}-icon`]} spin={loading} /> : iconElement ? iconElement : null}
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