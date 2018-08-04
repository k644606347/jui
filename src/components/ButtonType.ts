import { IconDefinition, IconProps } from "./Icon";

export interface IButtonIcons {
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

type IconType = keyof IButtonIcons;
type SizeType = 'small' | 'default' | 'large';
type ShapeType = 'circle';
type ButtonType = 'primary' | 'dashed' | 'warning';

export interface ButtonProps {
    className?: string;
    activeClassName?: string;
    inline?: boolean;
    type?: ButtonType;
    size?: SizeType;
    icon?: IconType | IconDefinition | React.ReactElement<IconProps>;
    shape?: ShapeType;
    disabled?: boolean;
    loading?: boolean;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}