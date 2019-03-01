import * as React from "react";
import Icon from "./Icon";
import { CSSAttrs, AnyFunction } from "../utils/types";
import { tools } from "../utils/Tools";
import { iconArrowBack, iconMore } from "./icons/SVGData";
import View from "./View";
import navBarCSS from './NavBar.scss';
tools.useCSS(navBarCSS);
export interface NavBarProps extends CSSAttrs {
    theme: 'light' | 'dark';
    leftContent: string | React.ReactNode;
    rightContent: string | React.ReactNode;
    onLeftClick?: AnyFunction;
    onRightClick?: AnyFunction;
}

export default class NavBar extends View<NavBarProps> {
    static defaultProps = {
        theme: 'light',
        leftContent: <Icon icon={iconArrowBack} />,
        rightContent: <Icon icon={iconMore} />,
    };
    cssObject = navBarCSS;
    render() {
        let { children, leftContent, rightContent, className, style, theme } = this.props,
            cssModules = this.cssModules;

        return (
            <div className={tools.classNames(cssModules.wrapper, theme && cssModules[theme], className)} style={style}>
                <div className={cssModules.leftContent} onClick={this.handleLeftClick}>{leftContent}</div>
                {
                    children ? 
                        <div className={cssModules.content}>
                            <div>
                                {
                                    tools.isFunction(children) ? children(this.props) : children
                                }
                            </div>
                        </div> : ''
                }
                <div className={cssModules.rightContent} onClick={this.handleRightClick}>{rightContent}</div>
            </div>
        )
    }
    handleLeftClick = (e) => {
        let { onLeftClick } = this.props;

        onLeftClick && onLeftClick(e);
    }
    handleRightClick = (e) => {
        let { onRightClick } = this.props;

        onRightClick && onRightClick(e);
    }
}