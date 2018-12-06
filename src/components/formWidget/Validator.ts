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
const ALLOWED_RULES = [
    'required', 'maxLength', 'minLength', 'maxZhLength', 'minZhLength', 
    'email', 'url', 'domain', 'mobilePhone', 'date', 'datetime', 'callback'
];
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
    getDefaultReport(): Report {
        return {
            isValid: true,
            msg: '',
        }
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

        return this.report(value, hitRule, processReport as Report);
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

        if (ALLOWED_RULES.indexOf(rule.rule) === -1) {
            result.isValid = false;
            result.msg = `"${rule.rule}"是无效的校验规则,请检查配置,可以使用的校验规则有:\n${JSON.stringify(ALLOWED_RULES)}`;
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
    report(value: string, hitRule?: Rule, injectReport?: Report): Report {
        let report: Report = {
            isValid: true,
            msg: "",
        };

        if (hitRule) {
            let { rule, level } = hitRule,
                { msg } = presetReport[rule];

            report = Object.assign(report, {
                value,
                isValid: false,
                level: level || 'error',
                msg: tools.isFunction(msg) ? msg(hitRule, value) : msg
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
        let result = true;

        if (tools.isString(value) || tools.isArray(value))
            result = value.length <= Number(rule.value)
        else 
            Log.warn(`maxLength校验无法生效，value必须是string / array，但是当前value=${JSON.stringify(value)}，将略过此次校验`);
        
        return result;
    },
    minLength(value: string | any[], rule: Rule) {
        let result = true;

        if (tools.isString(value) || tools.isArray(value))
            result = value.length >= Number(rule.value)
        else 
            Log.warn(`minLength校验无法生效，value必须是string / array，但是当前value=${JSON.stringify(value)}，将略过此次校验`);
        
        return result;
    },
    maxZhLength(value: any, rule: Rule) {
        let result = true;

        if (tools.isString(value))
            result = tools.calculateCharsByteLength(value) / 2 <= Number(rule.value);
        else 
            Log.warn(`maxZhLength校验无法生效，value必须是string，但是当前value=${JSON.stringify(value)}，将略过此次校验`);
        
        return result;
    },
    minZhLength(value: any, rule: Rule) {
        let result = true;

        if (tools.isString(value))
            result = tools.calculateCharsByteLength(value) / 2 >= Number(rule.value);
        else 
            Log.warn(`minZhLength校验无法生效，value必须是string，但是当前value=${JSON.stringify(value)}，将略过此次校验`);
        
        return result;
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