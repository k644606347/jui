import { IconProps, IconDefinition } from "./Icon";
import { IMenuItemsProps } from "./MenuItemsType";
import { IMenuItemChangeEvent, IMenuItemProps } from "./MenuItemType";

export interface IMenuItemGroupProps {
    name: string;
    label: string | JSX.Element;
    items: Array<IMenuItemProps | IMenuItemsProps>;
    value?: Array<IMenuItemChangeEvent[] | IMenuItemChangeEvent>;
    className?: string;
    style?: React.CSSProperties;
    icon?: React.ReactElement<IconProps> | IconDefinition;
    active?: boolean;
    onChange?: (e: IMenuItemChangeEvent) => void;
}