import { MouseEventHandler } from 'react';
import * as React from 'react';
import cssModule from './Button.scss';
import Icon from './Icon';

enum IconTypeEnum {
    'cloud' =  'cloud',
    'cloud-download' =  'cloud-download-alt',
    'cloud-upload' =  'cloud-upload-alt',
    'download' =  'download',
    'loading' =  'spinner',
    'power-off' =  'power-off',
    'search' =  'search',
};
type IconType = 'cloud' | 'cloud-download' | 'cloud-upload' | 'download' | 'loading' | 'power-off' | 'search';
type SizeType = 'small' | 'default' | 'large';
type ShapeType = 'circle';
type ButtonType = 'primary' | 'dashed' | 'danger';
export interface IButtonProps {
    className?: string;
    activeClassName?: string;
    inline?: boolean;
    type?: ButtonType;
    size?: SizeType;
    icon?: IconType;
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
            presetIcon = IconTypeEnum[icon + ''];

        if (!className) {
            className = cssModule.btn;
        }

        if (type) {
            className = className + ' ' + cssModule[type];
        }

        if (size) {
            className = className + ' ' + cssModule[size];
        }

        if (shape) {
            className = className + ' ' + cssModule[shape];
        }

        if (loading) {
            presetIcon = IconTypeEnum.loading;
        }

        if (disabled) {
            className = className + ' ' + cssModule.disabled;
        }

        if (inline) {
            className += ' ' + cssModule.inline;
        }

        return (
            <a style={style} className={className} onClick={this.handleClick}>
                {presetIcon ? <Icon icon={presetIcon} className={cssModule.icon} spin={loading}/> : null}
                {children !== undefined ? <React.Fragment><span>{children}</span></React.Fragment> : null}
            </a>
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