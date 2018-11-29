import * as React from "react";
import Icon from "./Icon";
import { CSSAttrs, AnyFunction } from "../utils/types";
import Tools from "../utils/Tools";
import navBarCSS from './NavBar.scss';
import { iconArrowBack, iconMore } from "./icons/SVGData";
export interface NavBarProps extends CSSAttrs {
    theme?: 'light' | 'dark';
    leftContent?: string | React.ReactNode;
    rightContent?: string | React.ReactNode;
    onLeftClick?: AnyFunction;
    onRightClick?: AnyFunction;
}

const tools = Tools.getInstance();

export default class NavBar extends React.PureComponent<NavBarProps, any> {
    static defaultProps: Partial<NavBarProps> = {
        theme: 'light',
        leftContent: <Icon icon={iconArrowBack} />,
        rightContent: <Icon icon={iconMore} />,
    };
    render() {
        let { children, leftContent, rightContent, className, style, theme } = this.props;

        return (
            <div className={tools.classNames(navBarCSS.wrapper, theme && navBarCSS[theme], className)} style={style}>
                <a className={navBarCSS.leftContent} onClick={this.handleLeftClick}>{leftContent}</a>
                <div className={navBarCSS.content}>
                    <div>
                        {
                            tools.isFunction(children) ? children(this.props) : children
                        }
                    </div>
                </div>
                <a className={navBarCSS.rightContent} onClick={this.handleRightClick}>{rightContent}</a>
            </div>
        )
    }
    handleLeftClick = (e: React.MouseEvent) => {
        let { onLeftClick } = this.props;

        onLeftClick && onLeftClick(e);
    }
    handleRightClick = (e: React.MouseEvent) => {
        let { onRightClick } = this.props;

        onRightClick && onRightClick(e);
    }
}