import { IconProps, IconDefinition } from "./Icon";
import { MenuItemProps, MenuItemChangeEvent } from "./MenuItemType";

export interface MenuItemsChangeEvent {
    id: string;
    items: Array<MenuItemChangeEvent | MenuItemsChangeEvent>;
    multiSelect?: boolean;
    activeIndex?: number;
}
export interface MenuItemsProps {
    id: string;
    label: string | JSX.Element;
    items: Array<MenuItemProps | MenuItemsProps>;
    checked?: string[];
    multiSelect?: boolean;
    level?: 1 | 2;
    activeIndex?: number;
    className?: string;
    style?: React.CSSProperties;
    icon?: React.ReactElement<IconProps> | IconDefinition;
    onChange?: (e: MenuItemsChangeEvent) => void;
}