import * as React from "react";

/**
 * ts3.0后支持了jsx中的defaultProps的识别，类化组件和函数式组件有不同的写法
 * 相关链接：https://www.tslang.cn/docs/release-notes/typescript-3.0.html
 */
interface Props { 
    name: string // 属性设置必选
};

/**
 * classify componengt
 */
class ClassifyComponent extends React.PureComponent<Props, any> {
    static defaultProps = {
        name: 'eee' // 对应默认值
    }
    render() {
        let { name } = this.props;
        name = name + ''; // 无需做非空判断
        return <div>{name}</div>
    }
}

/**
 * functional component
 * 使用LibraryManagedAttributes来关联props和defaultProps
 */
type TestProps = JSX.LibraryManagedAttributes<typeof ClassifyComponent, ClassifyComponent["props"]>;
function SFC({ name = "world" }: TestProps) {
    return <div>Hello ${name.toUpperCase()}!</div>;
}

// 通过检查！
export default () => 
    <React.Fragment>
        <SFC />
        <ClassifyComponent />
    </React.Fragment>