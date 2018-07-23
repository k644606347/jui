import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { IconProps } from "./Icon";
import { IMenuItemProps } from "./MenuItemType";
import { IMenuItemsProps } from "./MenuItemsType";

export interface IMenuProps {
    name: string;
    label: string | JSX.Element;
    items: Array<IMenuItemsProps | IMenuItemProps>;
    showItems?: boolean;
    icon?: React.ReactElement<IconProps> | IconDefinition;
    className?: string;
    style?: React.CSSProperties;
    multiple?: boolean;
    onChange?: (e: any) => void;
    level?: 1 | 2;
    activeIndex?: number;
}
export interface IMenuState {
    showItems: boolean;
    itemsRect: {
        top: number,
        left: number
    },
}