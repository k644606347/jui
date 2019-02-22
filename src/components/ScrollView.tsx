import View from "./View";
import * as React from "react";
import { CSSAttrs } from "../utils/types";
import { tools } from "../utils/Tools";
import scrollCSS from './ScrollView.scss';

export interface ContentProps extends CSSAttrs {
    children: any;
}
export interface ScrollViewState {
    scrollable: boolean;
}
type DisableScrollFilter = (scrollView: ScrollView) => boolean;
export default class ScrollView extends View<ContentProps, ScrollViewState> {
    static instances: ScrollView[] = [];
    private static disableTasks: Array<{ id: number | string, filter?: DisableScrollFilter }> = [];
    static addDisableTask(filter?: DisableScrollFilter) {
        let id = tools.genID();

        ScrollView.disableTasks.push({ id, filter });
        ScrollView.instances.forEach(instance => {
            let needProcess = this.disableTasks.some(task => 
                    tools.isFunction(task.filter) ? task.filter(instance) : true
                );
            if (needProcess) {
                instance.setState({scrollable: false});
            }
        });

        if (document.body) {
            let bodyTag = document.body,
                bodyClassList =  bodyTag.classList,
                scrollTop = bodyTag.scrollTop;

            if (!bodyClassList.contains(scrollCSS.disableBodyScroll)) {
                bodyClassList.add(scrollCSS.disableBodyScroll);
                if (tools.isNumber(scrollTop)) {
                    bodyTag.dataset.scrollTop = scrollTop + '';
                    bodyTag.style.top = -scrollTop + 'px';
                }
            }
        }

        return id;
    }
    static removeDisableTask(taskID: number | string) {
        let { disableTasks } = ScrollView,
            index = disableTasks.findIndex(task => task.id === taskID);

        index !== -1 && disableTasks.splice(index, 1);

        ScrollView.instances.forEach(instance => {
            let needProcess = !this.disableTasks.some(task => 
                    tools.isFunction(task.filter) ? task.filter(instance) : true
                );
            if (needProcess) {
                instance.setState({ scrollable: true });
            }
        });

        if (disableTasks.length === 0 && document.body) {
            let bodyTag = document.body,
                bodyClassList =  bodyTag.classList,
                scrollTop = Number(bodyTag.dataset.scrollTop);
                
            bodyClassList.remove(scrollCSS.disableBodyScroll);
            if (!Number.isNaN(scrollTop)) {
                bodyTag.scrollTop = scrollTop;
            }
            delete bodyTag.dataset.scrollTop;
            bodyTag.style.top = '';
        }
    }
    readonly state = {
        scrollable: true,
    }
    constructor(props) {
        super(props);


    }
    render() {
        let { children, className, style } = this.props,
            { scrollable } = this.state;

        console.log('scrollable', scrollable);
        return (
            <div style={style} className={tools.classNames(
                scrollCSS.wrapper, !scrollable && scrollCSS.disableScroll, className
            )}>
                {children}
            </div>
        );
    }
    componentDidMount() {
        ScrollView.instances.push(this);
    }
    componentDidCatch() {
        let index = ScrollView.instances.indexOf(this);

        if (index !== -1) {
            ScrollView.instances.splice(index, 1);
        }
    }
}