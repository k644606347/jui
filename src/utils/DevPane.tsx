import * as React from 'react';
import cssModules from './DevPane.scss';
import { EnvPageState, EnvPaneProps } from './DevPaneType';
import Tools from './Tools';

const tools = Tools.getInstance();
export default class EnvPane extends React.PureComponent<EnvPaneProps, EnvPageState> {
    constructor(props: EnvPaneProps) {
        super(props);

        this.state = {
            show: true,
        }
        this.handleCloseBtn = this.handleCloseBtn.bind(this);
        this.handleAppScrollable = this.handleAppScrollable.bind(this);
    }

    public render() {
        let { show } = this.state;

        return (
            <div className={
                tools.classNames(
                    cssModules.wrapper,
                    !show && cssModules.hide,
                )
            }>
                <a className={cssModules['close-btn']} onClick={this.handleCloseBtn}>
                {
                    show ? 'x' : '<-'
                }
                </a>
                <div className={cssModules.main}>
                    <p>ontouchstart: {('ontouchstart' in document) + ''}</p>
                    <p>ontouchmove: {('ontouchstart' in document) + ''}</p>
                    <p>ontouchend: {('ontouchstart' in document) + ''}</p>
                    <div>
                        <label><input type="checkbox" onChange={this.handleAppScrollable} />将div.App设置为可滚动</label>
                    </div>
                </div>
            </div>
        );
    }
    private handleAppScrollable(e: React.ChangeEvent) {
        let { target } = e,
            { checked } = target as HTMLInputElement,
            appTag = document.querySelector('div.App');

        if (!appTag) {
            return;
        }
        if (checked) {
            appTag.classList.add(cssModules['app-scrollable']);
        } else {
            appTag.classList.remove(cssModules['app-scrollable']);
        }
    }
    private handleCloseBtn(e: React.MouseEvent<HTMLElement>) {
        this.setState({ show: !this.state.show });
    }
}