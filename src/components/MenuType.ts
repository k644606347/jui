import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { IconProps } from "./Icon";
import { IMenuItemProps } from "./MenuItemType";
import { IMenuItemsProps } from "./MenuItemsType";

export interface IMenuProps {
    id: string;
    label: string | JSX.Element;
    items: Array<IMenuItemsProps | IMenuItemProps>;
    showItems?: boolean;
    icon?: React.ReactElement<IconProps> | IconDefinition;
    className?: string;
    style?: React.CSSProperties;
    multiSelect?: boolean;
    onShow?: () => void;
    onHide?: () => void;
    onChange?: (e: any) => void;
    level?: 1 | 2;
    activeIndex?: number;
    backdrop?: boolean;
    backdropClick?: boolean;
    backdropCoverage?: 'full' | 'bottom';
}
export interface IMenuState {
    itemsStyle: React.CSSProperties;
    backdropStyle: React.CSSProperties;
}