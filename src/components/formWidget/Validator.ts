import Tools from "../../utils/Tools";
import Log from "../../utils/Log";

interface RuleMap {
    required: boolean;
    maxLength: number;
    minLength: number;
    maxZhLength: number;
    minZhLength: number;
    email: boolean | RegExp | string;
    url: boolean | RegExp | string;
    domain: boolean | RegExp | string;
    mobilePhone: boolean | RegExp | string;
    date: boolean | RegExp | string;
    datetime: boolean | RegExp | string;
    callback: (value: any) => Promise<Report | boolean>;
}
export interface Rule {
    rule: keyof RuleMap;
    value?: RuleMap[Rule['rule']];
    level?: 'error' | 'warn';
}
export interface Report {
    fieldName?: string;
    isValid: boolean;
    msg: string;
    level?: 'error' | 'warn';
}

interface CheckRuleResult {
    isValid: boolean,
    msg: string,
    index?: number,
}
const allowedRules = [
    'required', 'maxLength', 'minLength', 'maxZhLength', 'minZhLength', 
    'email', 'url', 'domain', 'mobilePhone', 'date', 'datetime', 'callback'
];
const defaultLevel = 'error';

const tools = Tools.getInstance(),
    presetReport = {
        'required': { msg: '该字段不能为空' },
        'maxLength': { msg: (rule: Rule, value: any) => `字符个数不能大于${rule.value}` },
        'minLength': { msg: (rule: Rule, value: any) => `字符个数不能小于${rule.value}` },
        'maxZhLength': { msg: (rule: Rule, value: any) => `长度不能大于${rule.value}个汉字` },
        'minZhLength': { msg: (rule: Rule, value: any) => `长度不能小于${rule.value}个汉字` },
        'email': { msg: 'EMAIL格式不正确' },
        'url': { msg: 'URL格式不正确' },
        'domain': { msg: '域名格式不正确' },
        'datetime': { msg: '时间格式不正确' },
        'date': { msg: '日期格式不正确' },
        'mobilePhone': { msg: (rule: Rule, value: any) => `${value}不是有效的手机号码` },
        'callback': { msg: (rule: Rule, value: any) => `未通过校验, value=${JSON.stringify(value)}, rule=${JSON.stringify(rule)}` },
    };

const Validator = {
    defaultLevel,
    getDefaultReport(): Report {
        return {
            isValid: true,
            msg: '',
        }
    },
    compareReport(report: Report, prevReport: Report) {
        let isEqual = true,
            prevLevel = prevReport.level || defaultLevel,
            level = report.level || defaultLevel;

        if (prevReport === report) {
            return isEqual;
        }
        if (prevReport.isValid !== report.isValid || prevLevel !== level || prevReport.msg !== report.msg) {
            isEqual = false;
        }
        return isEqual;
    },
    async validate(value: any, rules: Rule[]) {
        let hitRule, processReport;

        let checkRulesResult = this.checkRules(rules);

        if (checkRulesResult.isValid) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < rules.length; i++) {
                let rule = rules[i], 
                    processor = Validator[rule.rule];

                let processResult = await processor(value, rule);
                if (tools.isPlainObject(processResult)) {
                    if (!processResult.isValid) {
                        hitRule = rule;
                        processReport = processResult;
                        break;
                    }
                } else {
                    if (!processResult) {
                        hitRule = rule;
                        break;
                    }
                }
            }
        } else {
            let msg = checkRulesResult.msg;
            Log.error(msg);
            processReport = {
                msg,
                isValid: false,
                level: "error"
            };
        }

        return this.report(value, hitRule, processReport);
    },
    checkRule(rule: any): CheckRuleResult {
        let result: CheckRuleResult = {
            isValid: true,
            msg: '',
        };
        
        if (!tools.isPlainObject(rule)) {
            result.isValid = false;
            result.msg = `校验规则必须是对象形式,请检查配置,当前是:\n${JSON.stringify(rule)}`;
            return result;
        }

        if (!rule.rule) {
            result.isValid = false;
            result.msg = `校验规则必须包含非空的rule字段,请检查配置,当前是:\n${JSON.stringify(rule)}`;
            return result;
        }

        if (allowedRules.indexOf(rule.rule) === -1) {
            result.isValid = false;
            result.msg = `"${rule.rule}"是无效的校验规则,请检查配置,可以使用的校验规则有:\n${JSON.stringify(allowedRules)}`;
            return result;
        }

        return result;
    },
    checkRules(rules: any[]): CheckRuleResult {
        let result: CheckRuleResult = {
            isValid: true,
            msg: '',
        };

        if (!tools.isArray(rules)) {
            result = {
                isValid: false,
                msg: `rules必须是数组, 当前是:\n${JSON.stringify(rules)},\n请检查配置`,
            };
            return result;
        }
        for (let i = 0; i < rules.length; i++) {
            let ruleResult = this.checkRule(rules[i]);

            if (!ruleResult.isValid) {
                result = ruleResult;
                result.index = i;
            }
        }
        return result;
    },
    report(value: string, hitRule?: Rule, injectReport?: Report) {
        let report: Report = {
            isValid: true,
            msg: "",
        };

        if (hitRule) {
            let { rule, level } = hitRule,
                { msg: presetMsg } = presetReport[rule];

            report = Object.assign(report, {
                isValid: false,
                level: level || defaultLevel,
                msg: tools.isFunction(presetMsg) ? presetMsg(hitRule, value) : presetMsg
            });
        }

        if (injectReport) {
            report = Object.assign(report, injectReport);
        }

        return report;
    },
    required(value: any, rule: Rule) {
        if (!rule.value)
            return true;
            
        if (tools.isArray(value)) {
            return value.length > 0;
        } else if (tools.isPlainObject(value)) {
            return !tools.isEmptyObject(value);
        } else {
            return String(value) !== "" && value !== undefined && value !== null;
        }
    },
    maxLength(value: any, rule: Rule) {
        if (!tools.isString(value) && !tools.isArray(value)) {
            value = String(value);
            Log.warn(`校验maxLength时，值必须是string/array，但当前值是${JSON.stringify(value)}，将会强制转换值为string做校验`);
        }
        return value.length <= Number(rule.value);
    },
    minLength(value: string | any[], rule: Rule) {
        if (!tools.isString(value) && !tools.isArray(value)) {
            value = String(value);
            Log.warn(`校验minLength时，值必须是string/array，但当前值是${JSON.stringify(value)}，将会强制转换值为string做校验`);
        }
        return value.length >= Number(rule.value);   
    },
    maxZhLength(value: any, rule: Rule) {
        if (!tools.isString(value) && !tools.isArray(value)) {
            value = String(value);
            Log.warn(`校验maxZhLength时，值必须是string/array，但当前值是${JSON.stringify(value)}，将会强制转换值为string做校验`);
        }
        return tools.calculateCharsByteLength(value) / 2 <= Number(rule.value);
    },
    minZhLength(value: any, rule: Rule) {
        if (!tools.isString(value) && !tools.isArray(value)) {
            value = String(value);
            Log.warn(`校验minZhLength时，值必须是string/array，但当前值是${JSON.stringify(value)}，将会强制转换值为string做校验`);
        }
        return tools.calculateCharsByteLength(value) / 2 >= Number(rule.value);
    },
    email(value: any) {
        return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(String(value));
    },
    url(value: any) {
        return /^http[s]?:\/\/[\w\-]+\.[\w\-]+.*/.test(String(value));
    },
    domain(value: any) {
        return /^http[s]?:\/\/[\w]+\.[\w]+\/?/.test(String(value));
    },
    datetime(value: any) {
        return /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(
            String(value)
        );
    },
    date(value: any) {
        return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(String(value));
    },
    async callback(value: string, rule: Rule): Promise<Report | boolean> {
        let callbackResult: Report | boolean;

        if (tools.isFunction(rule.value)) {
            try {
                // valid case
                callbackResult = Boolean(await rule.value(value));
            } catch (e) {
                // invalid case
                if (e instanceof Error) {
                    let errorMsg = `callback函数执行报错, 无法完成校验, 报错信息: ${e}`;

                    // throw error时level设置为error级别
                    callbackResult = {
                        msg: errorMsg,
                        isValid: false,
                        level: "error"
                    };
                    Log.error(errorMsg);
                } else {
                    // 正常的驳回流程
                    callbackResult = {
                        isValid: false,
                        msg: tools.isString(e) ? e : JSON.stringify(e)
                    };
                }
            }
        } else {
            let errorMsg = `配置错误，无法校验，当rule是callback时，value必须是函数, 当前是: ${rule.value}`;
            callbackResult = {
                msg: errorMsg,
                isValid: false,
                level: "error"
            };
            Log.error(errorMsg);
        }

        return callbackResult;
    },
};
export default Validator;