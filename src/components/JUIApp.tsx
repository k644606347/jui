import * as React from 'react';
import { CSSAttrs } from '../utils/types';
import Tools from '../utils/Tools';
import css from './JUIApp.scss';
import { StatefulToast } from './Toast';

interface Props extends CSSAttrs {
    children: any;
}

const tools = Tools.getInstance();
export default (props: Props) => {
    let { children, className, style } = props;

    return (
        <div className={tools.classNames(css.wrapper, className)} style={style}>
            <StatefulToast />
            {children}
        </div>
    );
}