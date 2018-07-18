import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface ItemData {
    label: string;
    value: string;
    className?: string;
    style?: React.CSSProperties;
    render?: (data: ItemData) => JSX.Element;
}
export interface ItemGroupData {
    label: string | JSX.Element;
    items: Array<ItemData | ItemGroupData>;
    className?: string;
    style?: React.CSSProperties;
    multiple?: boolean;
    render?: (data: ItemGroupData) => JSX.Element;
}
export interface IMenuItemsProps {
    items: Array<ItemGroupData | ItemData>;
    multiple?: boolean;
    onChange?: React.EventHandler<any>;
    level?: 1 | 2;
    // items: IMenuProps['items'];
    // className?: IMenuProps['className'];
    // style?: IMenuProps['style'];
    // multiple?: IMenuProps['multiple'];
    // onChange?: IMenuProps['onChange'];
}
export interface IMenuProps {
    // children: JSX.Element[];
    label: string | JSX.Element;
    items: Array<ItemGroupData | ItemData>;
    icon?: IconDefinition;
    className?: string;
    style?: React.CSSProperties;
    multiple?: boolean;
    onChange?: React.EventHandler<any>;
    level: 1 | 2;
}