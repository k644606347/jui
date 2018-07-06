import { MouseEventHandler } from 'react';
import * as React from 'react';
import cssModule from './Button.scss';
import Icon from './Icon';
import TouchFeedback from './TouchFeedback';
import Tools from '../utils/Tools';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { solid_Spinner } from './FontAweSomeMap';

const prefixCls = 'btn';
// enum IconTypeEnum {
//     'cloud' = 'cloud',
//     'cloud-download' = 'cloud-download-alt',
//     'cloud-upload' = 'cloud-upload-alt',
//     'download' = 'download',
//     'loading' = 'spinner',
//     'power-off' = 'power-off',
//     'search' = 'search',
// };
// type IconType = 'cloud' | 'cloud-download' | 'cloud-upload' | 'download' | 'loading' | 'power-off' | 'search';
type SizeType = 'small' | 'default' | 'large';
type ShapeType = 'circle';
type ButtonType = 'primary' | 'dashed' | 'warning';
export interface IButtonProps {
    className?: string;
    activeClassName?: string;
    inline?: boolean;
    type?: ButtonType;
    size?: SizeType;
    icon?: IconDefinition;
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
            { children, className, disabled, icon, inline, loading, shape, style, size, type } = props;

        if (loading) {
            icon = solid_Spinner;
        }

        className = Tools.classNames(cssModule.btn, [type, disabled && 'disabled', inline && 'inline', size, shape].map(n => cssModule[`${prefixCls}-${n}`]), className);

        return (
            <TouchFeedback activeClassName={cssModule[`${prefixCls}-active`]} disabled={disabled}>
                <a style={style} className={className} onClick={this.handleClick}>
                    {icon ? <Icon icon={icon} className={cssModule[`${prefixCls}-icon`]} spin={loading} /> : null}
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