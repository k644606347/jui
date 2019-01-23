import Tools from "../utils/Tools";
import Log from "../utils/Log";
import { AnyFunction } from "../utils/types";
import { processors, AllowedRule, ShorthandRule, allowedRules, shorthandRules } from "./Processors";

export interface Rule {
    type: AllowedRule;
    value?: any;
    level?: 'error' | 'warn';
    msg?: string;
};
export type RuleParam = Rule | RegExp | AnyFunction | ShorthandRule;
export interface Report {
    isValid: boolean;
    level?: 'error' | 'warn';
    msg?: string;
    fieldName?: string;
}
const tools = Tools.getInstance(),
    presetReports: { [k in AllowedRule]: { msg: AnyFunction | string } } = {
        required: { msg: '该字段不能为空' },
        maxLength: { msg: (rule: Rule, value: any) => `字符个数不能大于${rule.value}` },
        minLength: { msg: (rule: Rule, value: any) => `字符个数不能小于${rule.value}` },
        maxZhLength: { msg: (rule: Rule, value: any) => `长度不能大于${rule.value}个汉字` },
        minZhLength: { msg: (rule: Rule, value: any) => `长度不能小于${rule.value}个汉字` },
        regexp: { msg: (rule: Rule, value) => `未通过校验规则: ${rule.value}` },
        email: { msg: 'EMAIL格式不正确' },
        url: { msg: 'URL格式不正确' },
        domain: { msg: '域名格式不正确' },
        datetime: { msg: '时间格式不正确' },
        date: { msg: '日期格式不正确' },
        mobilePhone: { msg: (rule: Rule, value: any) => `${value}不是有效的手机号码` },
        callback: { msg: (rule: Rule, value: any) => `未通过校验函数` },
    };

class Validator {
    private static instances: Validator[] = [];
    static getInstance() {
        const instances = Validator.instances;

        return instances.length === 0 ? new Validator() : instances[0];
    }
    getDefaultLevel(): 'error' {
        return 'error';
    }
    getDefaultReport(): Report {
        return {
            isValid: true,
            msg: '',
        }
    }
    isValidRule(rule): rule is Rule {
        if (!tools.isPlainObject(rule)) {
            return false;
        }

        if (allowedRules.indexOf(rule.type) !== -1) {
            return true;
        }
        return false;
    }
    isValidReport(report): report is Report {
        if (!tools.isPlainObject(report)) {
            return false;
        }

        if (tools.isBoolean(report.isValid)) {
            return true;
        }
        return false;
    }
    compareReport(report: Report, prevReport: Report) {
        let isEqual = true,
            prevLevel = prevReport.level || this.getDefaultLevel(),
            level = report.level || this.getDefaultLevel();

        if (prevReport === report) {
            return isEqual;
        }
        if (prevReport.isValid !== report.isValid || prevLevel !== level || prevReport.msg !== report.msg) {
            isEqual = false;
        }
        return isEqual;
    }
    async validate(value, ruleParams: RuleParam | RuleParam[]): Promise<Report> {
        let rules = this.convertRuleParams2Rules(ruleParams),
            hitRule, processReport;

        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i], 
                processor = processors[rule.type] as AnyFunction,
                isValid = true;

            let result = await processor(value, rule.value);
            
            if (this.isValidReport(result)) {
                isValid = result.isValid;
                if (!isValid)
                    processReport = result;
            } else {
                isValid = !!result;
            }

            if (!isValid) {
                hitRule = rule;
                break;
            }
        }
        return this.report(value, hitRule, processReport);
    }
    report(value: string, hitRule?: Rule, injectReport?: Report): Report {
        let report: Report = {
                isValid: true,
                msg: "",
            };

        if (hitRule) {
            let { level, msg = '' } = hitRule;
            report = Object.assign(report, {
                isValid: false,
                level: level || this.getDefaultLevel(),
                msg,
            });

            if (report.msg === '') {
                let { msg } = presetReports[hitRule.type];
                report.msg = tools.isFunction(msg) ? msg(hitRule, value) : msg + ''
            }
        }

        if (injectReport) {
            report = Object.assign(report, injectReport);
        }

        return report;
    }
    convertRuleParam2Rule(ruleParam: RuleParam) {
        let rule: Rule;

        if (tools.isRegExp(ruleParam)) {
            rule = { type: 'regexp',  value: ruleParam, level: 'error', msg: '' };
        } else if (tools.isFunction(ruleParam)) {
            rule = { type: 'callback', value: ruleParam, level: 'error', msg: '' };
        } else if (tools.isString(ruleParam) && shorthandRules.indexOf(ruleParam) !== -1) {
            rule =  { type: ruleParam, level: 'error',  msg: '' };
        } else if (this.isValidRule(ruleParam)) {
            rule = ruleParam;
        } else {
            throw new Error(`校验规则无效，请检查配置, 
                当前规则: ${JSON.stringify(ruleParam)}, 
                有效的规则: RegExp | Function | { type: ${allowedRules.join(' | ')}, value?: any }`);
        }
        return rule;
    }
    convertRuleParams2Rules(ruleParams: RuleParam | RuleParam[]) {
        let rules: Rule[] = [];
        if (tools.isArray(ruleParams)) {
            ruleParams.forEach(ruleParam => {
                rules.push(this.convertRuleParam2Rule(ruleParam));
            });
        } else 
            rules.push(this.convertRuleParam2Rule(ruleParams));

        return rules;
    }
}
export default Validator;

let validator = Validator.getInstance();
export { validator };