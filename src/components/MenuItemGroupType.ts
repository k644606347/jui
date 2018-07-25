import { IconProps, IconDefinition } from "./Icon";

export interface ChangeEvent {
    id: string;
}

export interface IMenuItemGroupProps {
    id: string;
    label: string | JSX.Element;
    active?: boolean;
    className?: string;
    style?: React.CSSProperties;
    icon?: React.ReactElement<IconProps> | IconDefinition;
    onChange?: (e: ChangeEvent) => void;
}