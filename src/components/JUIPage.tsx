import * as React from 'react';
import { CSSAttrs } from '../utils/types';
import { tools } from '../utils/Tools';
import css from './JUIPage.scss';
import View from './View';
const cssModules = tools.useCSS(css);

interface Props extends CSSAttrs {}

export default class JUIPage extends React.PureComponent<Props> {

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