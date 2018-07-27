import * as React from 'react';
import cssModules from './EnvPane.scss';

// tslint:disable-next-line:no-empty-interface
export interface EnvPaneProps {
}

export default class EnvPane extends React.PureComponent<EnvPaneProps, any> {
    constructor(props: EnvPaneProps) {
        super(props);
    }

    public render() {
        return <div className={cssModules.wrapper}>
            <p>ontouchstart: {('ontouchstart' in document) + ''}</p>
            <p>ontouchmove: {('ontouchstart' in document) + ''}</p>
            <p>ontouchend: {('ontouchstart' in document) + ''}</p>
        </div>
    }
}