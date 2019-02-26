import * as React from "react";
import * as ReactDOM from "react-dom";
import { tools } from "../utils/Tools";
import { AnyObject } from "../utils/types";

abstract class View<P = {}, S = {}, SS = any> extends React.PureComponent<P, S, SS> {
    abstract cssObject: AnyObject;
    cssObjectIsValid = false;
    styleLoaderIsUseable = false;
    mounted = false;
    constructor(props) {
        super(props);

        this.initRender();
        this.initComponentDidMount();
    }
    private initRender() {
        let render = this.render.bind(this),
            proxy = () => {
                if (!this.mounted)
                    this.initCSSObject();

                return render();
            }
        this.render = proxy.bind(this);
    }
    private initComponentDidMount() {
        let componentDidMount = this.componentDidMount.bind(this),
            componentName = this.getClass().componentName || this.getClass().name,
            proxy = () => {
                let dom = ReactDOM.findDOMNode(this);
                
                if (dom instanceof Element) {
                    dom.setAttribute('jui-component', componentName);
                }
                this.mounted = true;
                componentDidMount();
            }
        this.componentDidMount = proxy.bind(this);
    }
    private initCSSObject() {
        let { cssObject } = this;
        if (tools.isPlainObject(cssObject)) {
            if (tools.isFunction(cssObject.use)) {// style-loader开启了useable
                this.cssObject.use();
                this.styleLoaderIsUseable = true;
            }
            this.cssObjectIsValid = true;
        } else {
            this.cssObject = cssObject = {};
        }
    }
    componentDidMount() {}
    getCSSModules() {
        return this.styleLoaderIsUseable ? this.cssObject.locals : this.cssObject;
    }
    getCSSModule(key) {
        return this.getCSSModules()[key];
    }
    getClass(): any {
        return this.constructor;
    }
}

export default View;