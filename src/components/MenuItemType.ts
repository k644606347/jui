import { IconProps, IconDefinition } from "./Icon";

export interface MenuItemChangeEvent {
    value: string;
    checked: boolean;
}
export interface MenuItemProps {
    label: string | JSX.Element;
    value: string;
    name: string; 
    checked?: boolean;
    className?: string;
    style?: React.CSSProperties;
    icon?: React.ReactElement<IconProps> | IconDefinition;
    multiSelect?: boolean;
    onChange?: (e: MenuItemChangeEvent) => void;
}
export interface MenuItemState {
    clicked: boolean;
}