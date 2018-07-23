import { IconProps, IconDefinition } from "./Icon";

export interface IMenuItemChangeEvent {
    name: string;
    checked: boolean;
}
export interface IMenuItemProps {
    name: string;
    label: string | JSX.Element;
    className?: string;
    style?: React.CSSProperties;
    icon?: React.ReactElement<IconProps> | IconDefinition;
    checked?: boolean;
    active?: boolean;
    onChange?: (e: IMenuItemChangeEvent) => void;
}