import { IconProps, IconDefinition } from "./Icon";

export interface IMenuItemChangeEvent {
    value: string;
    checked: boolean;
}
export interface IMenuItemProps {
    label: string | JSX.Element;
    value: string;
    name: string; 
    checked?: boolean;
    className?: string;
    style?: React.CSSProperties;
    icon?: React.ReactElement<IconProps> | IconDefinition;
    multiSelect?: boolean;
    onChange?: (e: IMenuItemChangeEvent) => void;
}
export interface IMenuItemState {
    clicked: boolean;
}