import Tools from "../../utils/Tools";
import Log from "../../utils/Log";

// TODO 待实现，考虑启用此接口作为Rule传参规范，但运行时获取的配置无法用到此检测
// interface RuleMap {
//     required?: boolean;
//     maxLength?: number;
//     minLength?: number;
//     maxZhLength?: number;
//     minZhLength?: number;
//     email?: boolean | RegExp | string;
//     url?: boolean | RegExp | string;
//     domain?: boolean | RegExp | string;
//     mobilePhone?: boolean | RegExp | string;
//     date?: boolean | RegExp | string;
//     datetime?: boolean | RegExp | string;
//     callback?: (value: any) => Report;
// }
export interface Rule {
    rule: string;
    value?: any;
    level?: 'error' | 'warn';
}
export interface Report {
    isValid: boolean;
    value?: any;
    msg: string;
    hitRule?: Rule;
    level?: 'error' | 'warn';
}

const tools = Tools.getInstance(),
    presetReport = {
        'required': { msg: '该字段不能为空' },
        'maxLength': { msg: '字符个数不能大于{value}' },
        'minLength': { msg: '字符个数不能小于{value}' },
        'maxZhLength': { msg: '长度不能大于{value}个汉字' },
        'minZhLength': { msg: '长度不能小于{value}个汉字' },
        'email': { msg: 'EMAIL格式不正确' },
        'url': { msg: 'URL格式不正确' },
        'domain': { msg: '域名格式不正确' },
        'datetime': { msg: '时间格式不正确' },
        'date': { msg: '日期格式不正确' },
        'mobilePhone': { msg: '{value}不是有效的手机号码' },
        'callback': { msg: '数据错误' },
    };

const Validator = {
    validate(value: string, rules: Rule[]) {
        return this.report(
            value,
            rules.find(rule => {
                let processor = Validator[rule.rule];

                if (tools.isFunction(processor)) {
                    return processor(value, rule) === false;
                } else {
                    Log.log(`无效的校验规则[${rule.rule}]，请检查配置`);
                    return false;
                }
            })
        );
    },
    report(value: string, hitRule?: Rule): Report {
        let report: Report = {
                value,
                isValid: true,
                msg: ''
            },
            buildMsg = (msg: string) => value !== undefined ? msg.replace('{value}', value) : msg;

        if (hitRule) {
            let { rule, level } = hitRule,
                presetConfig = presetReport[rule];

            report = { ...report, value, isValid: false, hitRule, level, msg: buildMsg(presetConfig.msg) };
        }

        return report;
    },
    required(value: string) {
        return value !== '';
    },
    maxlength(value: string, rule: Rule) {
        return value.length < Number(rule.value);
    },
    minLength(value: string, rule: Rule) {
        return value.length > Number(rule.value);
    },
    maxZhLength(value: string, rule: Rule) {
        return (tools.calculateCharsByteLength(value) / 2) <= Number(rule.value);
    },
    minZhLength(value: string, rule: Rule) {
        return (tools.calculateCharsByteLength(value) / 2) >= Number(rule.value);
    },
    email(value: string) {
        return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(String(value));
    },
    url(value: string) {
        return /^http[s]?:\/\/[\w\-]+\.[\w\-]+.*/.test(String(value));
    },
    domain(value: string) {
        return /^http[s]?:\/\/[\w]+\.[\w]+\/?/.test(String(value));
    },
    datetime(value: string) {
        return /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(String(value));
    },
    date(value: string) {
        return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(String(value));
    },
    callback(value: string, rule: Rule) {
        return tools.isFunction(rule.value) ? rule.value(value) : false;
    }
}
export default Validator;