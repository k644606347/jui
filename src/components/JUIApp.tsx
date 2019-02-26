import * as React from 'react';
import { CSSAttrs } from '../utils/types';
import { tools } from '../utils/Tools';
import css from './JUIApp.scss';
import View from './View';

const cssModules = tools.getCSSModulesBy(css);
interface Props extends CSSAttrs {}

export default class JUIApp extends View<Props> {
    cssObject = css;
    constructor(props) {
        super(props);
    }
    render() {
        let { children, className, style } = this.props;

        return (
            <div className={tools.classNames(cssModules.wrapper, className)} style={style}>
                {children}
            </div>
        );
    }
}