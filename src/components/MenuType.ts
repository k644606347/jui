import { IconProps, IconDefinition } from "./Icon";
import { MenuItemProps } from "./MenuItemType";
import { MenuItemsProps, MenuItemsChangeEvent } from "./MenuItemsType";

export interface MenuProps {
    id: string;
    label: string | JSX.Element;
    items: Array<MenuItemsProps | MenuItemProps>;
    // children: Array<React.ReactElement<MenuItemProps>>;
    showItems?: boolean;
    icon?: React.ReactElement<IconProps> | IconDefinition;
    className?: string;
    style?: React.CSSProperties;
    multiSelect?: boolean;
    onShow?: () => void;
    onHide?: () => void;
    onChange?: (e: MenuItemsChangeEvent) => void;
    level?: 1 | 2;
    activeIndex?: number;
    backdrop?: boolean;
    backdropClick?: boolean;
    backdropCoverage?: 'full' | 'bottom';
}
export interface MenuState {
    itemsStyle: React.CSSProperties;
    backdropStyle: React.CSSProperties;
}