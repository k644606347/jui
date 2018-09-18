import * as ReactIs from "react-is";

/**
 * copy 自 https://github.com/mridgway/hoist-non-react-statics
 */
const REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    getDerivedStateFromProps: true,
    mixins: true,
    propTypes: true,
    type: true
};

const KNOWN_STATICS = {
    arguments: true,
    arity: true,
    callee: true,
    caller: true,
    length: true,
    name: true,
    prototype: true,
};

const TYPE_STATICS = {
    [ReactIs.ForwardRef]: {
        ['$$typeof']: true,
        render: true
    }
};

const defineProperty = Object.defineProperty;
const getOwnPropertyNames = Object.getOwnPropertyNames;
const getOwnPropertySymbols = Object.getOwnPropertySymbols;
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const getPrototypeOf = Object.getPrototypeOf;
const objectPrototype = Object.prototype;

export default function hoistNonReactStatics<P>(targetComponent: React.ComponentType<P>, sourceComponent: React.ComponentType, blacklist?: any): React.ComponentType<P> {
    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components

        if (objectPrototype) {
            const inheritedComponent = getPrototypeOf(sourceComponent);
            if (inheritedComponent && inheritedComponent !== objectPrototype) {
                hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
            }
        }

        let keys: Array<string | symbol> = getOwnPropertyNames(sourceComponent);

        if (getOwnPropertySymbols) {
            keys = keys.concat(getOwnPropertySymbols(sourceComponent));
        }

        // tslint:disable-next-line:no-string-literal
        const targetStatics = TYPE_STATICS[targetComponent['$$typeof']] || REACT_STATICS;
        // tslint:disable-next-line:no-string-literal
        const sourceStatics = TYPE_STATICS[sourceComponent['$$typeof']] || REACT_STATICS;

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            if (!KNOWN_STATICS[key] &&
                !(blacklist && blacklist[key]) &&
                !(sourceStatics && sourceStatics[key]) &&
                !(targetStatics && targetStatics[key])
            ) {
                const descriptor = getOwnPropertyDescriptor(sourceComponent, key);
                try { // Avoid failures from read-only properties
                    descriptor && defineProperty(targetComponent, key, descriptor);
                } catch (e) {}
            }
        }

        return targetComponent;
    }

    return targetComponent;
};
