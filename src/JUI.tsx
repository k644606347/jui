// TODO 类型导出应该增加命名空间，类似react的类型导出方式
// 页面框架层
import JUIPage from './components/JUIPage';
import ScrollView from './components/ScrollView';

// 底层组件层，最细粒度的组件，不依赖或很少依赖其他component
import TouchFeedback from "./components/TouchFeedback";
import Icon from "./components/Icon";
import Button from "./components/Button";
import Label from "./components/Label";
import Input from "./components/Input";
import Textarea from "./components/Textarea";
import Radio from "./components/Radio";
import Checkbox from "./components/Checkbox";

import Message from "./components/Message";
import NavBar from "./components/NavBar";
import Toast, { toast } from "./components/Toast";

import List from "./components/List";
import Pagination from "./components/Pagination";

import MenuItem from "./components/MenuItem";
import MenuItemGroup from "./components/MenuItemGroup";
import Menu from "./components/Menu";
import Modal from './components/Modal';

import Form from './components/Form';
export {
    JUIPage,
    ScrollView,
    Form,
    Button,
    Icon,
    Checkbox,
    Radio,
    Label,
    List,
    Pagination,
    Menu,
    MenuItem,
    MenuItemGroup,
    TouchFeedback,
    Message,
    Input,
    Textarea,
    NavBar,
    Modal,
    Toast,
    toast,
}