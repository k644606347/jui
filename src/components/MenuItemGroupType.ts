import { IconProps, IconDefinition } from "./Icon";
import { MenuItemsProps } from "./MenuItemsType";

export interface ClickEvent {
    id: string;
    targetItems?: React.ReactElement<MenuItemsProps>;
}
export interface MenuItemGroupProps {
    id: string;
    label: string | JSX.Element;
    targetItems?: React.ReactElement<MenuItemsProps>;
    active?: boolean;
    className?: string;
    style?: React.CSSProperties;
    icon?: React.ReactElement<IconProps> | IconDefinition;
    onClick?: (e: ClickEvent) => void;
}
export interface MenuItemGroupState {
    clicked: boolean;
}