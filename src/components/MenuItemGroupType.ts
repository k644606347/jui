import { IconProps, IconDefinition } from "./Icon";
import { IMenuItemsProps } from "./MenuItemsType";

export interface ChangeEvent {
    id: string;
}
export interface IMenuItemGroupProps {
    id: string;
    label: string | JSX.Element;
    targetItems?: React.ReactElement<IMenuItemsProps>;
    active?: boolean;
    className?: string;
    style?: React.CSSProperties;
    icon?: React.ReactElement<IconProps> | IconDefinition;
    onChange?: (e: ChangeEvent) => void;
}
export interface IMenuItemGroupState {
    clicked: boolean;
}