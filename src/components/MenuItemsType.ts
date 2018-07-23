import { IconProps, IconDefinition } from "./Icon";
import { IMenuItemChangeEvent, IMenuItemProps } from "./MenuItemType";

export interface IMenuItemsProps {
    name: string;
    label: string | JSX.Element;
    items: Array<IMenuItemProps | IMenuItemsProps>;
    value?: any;
    multiple?: boolean;
    level?: 1 | 2;
    activeIndex?: number;
    className?: string;
    style?: React.CSSProperties;
    icon?: React.ReactElement<IconProps> | IconDefinition;
    onChange?: (e: any) => void;
    // onChange?: (e: Array<IMenuItemChangeEvent[] | IMenuItemChangeEvent>) => void;
}