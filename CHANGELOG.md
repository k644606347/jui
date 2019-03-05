#### 发布周期

* 修订版本号：每周末会进行日常 bugfix 更新。（如果有紧急的 bugfix，则任何时候都可发布）
* 次版本号：每月发布一个带有新特性的向下兼容的版本。
* 主版本号：含有破坏性更新和新特性，不在发布周期内。

---
## 1.0.2

`2019-03-05`
- 💄考虑到activeform逻辑较复杂，将activeform将迁出jui，放在单独的项目中




## 1.0.1

`2019-03-01`
- 💄 变更css加载的机制, 改为在import时加载css，而不是在创建组件对象时加载




## 1.0.0

`2019-02-26`
- 🌟 增加了ScrollView用于处理ios/android下多个滚动位发生滚动穿透，ios下滚动不流畅等问题(实验性)
- 🌟 重写Button组件样式，增加outline/clear风格
- 🌟 重写Toast组件，更多的配置项，更好的弹出效果，支持多种位置配置
- 🌟 ActiveForm精简rerender次数
- 🌟 增加ValidateMessage
- 🐞 修复若干bug



## 0.5.0

`2018-12-06`
- 🌟 增加defaultProps的识别，不用再额外编写非空检查
- 🌟 更换图标库
- 🌟 更新ts/react，优化构建脚本
- 🐞 修复若干bug



## 0.4.0

`2018-10-26`
- 🌟 增加NavBar / Modal / Toast组件
- 🌟 增加JUIApp，作为最外层容器，会做一些通用样式/初始化组件等设置
- 🌟 重新设计了FormWidget运行机制
- 🐞 修复若干bug


## 0.3.0

`2018-09-14`
- 🌟 支持使用es2018语法
- 🌟 增加Message组件
- 🌟 增加CheckboxItems / RadioItems组件
- 💄 优化了Validator的报错提示
- 💄 优化了Checkbox / Radio 在disabled状态下的行为
- 🐞 修复Input组件在ios safari 11.4下无法连续键入或删除字符的bug


## 0.2.0
`2018-09-07`
- 🌟 增加FormWidget机制
- 🌟 增加Input / Checkbox / Radio 组件
- 🐞 修复若干bug