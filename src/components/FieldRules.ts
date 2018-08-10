// declare namespace FieldRules {
//     interface Required {
//         required: boolean;
//         msg: string;
//     }
//     interface MaxValue {
//         maxValue?: number;
//         minValue?: number;
//     }
// }
// export default FieldRules;

export type RuleTypes = 'required' | 'maxValue' | 'minValue';
export interface FieldRule {
    rule: RuleTypes;
    msg: string;
}