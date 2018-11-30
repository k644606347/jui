import { IconDefinition, IconProps } from "./Icon";

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
    'more': IconDefinition;
    'more-v': IconDefinition;
    'up': IconDefinition;
    'right': IconDefinition;
    'down': IconDefinition;
    'left': IconDefinition;
}

type IconType = keyof PresetIcons;
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