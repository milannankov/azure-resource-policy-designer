type CriteriaValueType = string | Array<string>;
type FieldValueConverter = (fieldValue: CriteriaValueType) => CriteriaValueType;

const CriteriaExpressionRegExp = new RegExp("^\\[(json|if|and|or|not|concat|parameters|variables|deployment|reference|resourceId|resourceGroup|subscription|list.*|base64|providers|copyIndex|padLeft|replace|toLower|toUpper|startsWith|endsWith|length|split|skip|take|contains|intersection|union|first|last|indexOf|lastIndexOf|add|sub|mul|div|mod|min|max|range|string|int|float|bool|trim|uri|uniqueString|substring|base64ToString|base64ToJson|uriComponentToString|uriComponent|dataUriToString|dataUri|array|createArray|coalesce|empty|less|lessOrEquals|greater|greaterOrEquals|equals)\\(.*\\).*\\]$");

export class CriteriaValue {

    public readonly isExpression : boolean = false;
    public readonly isArray : boolean = false;

    constructor(public readonly value: CriteriaValueType = "") {

        if (typeof value === "string") {
            this.isExpression = CriteriaExpressionRegExp.test(value);
        }
        else {
            this.isArray = true;
        }
    }

    public static empty() {
        return new CriteriaValue("");
    }
}

export interface IPolicyCriteriaDescriptor {
    id: string;
    caption: string;
    description: string;
    isMatch(value: string): boolean;
    convertValue(fieldValue: CriteriaValueType) : CriteriaValueType;
}

// TODO: check default interfaces

class PolicyCriteriaDescriptor implements IPolicyCriteriaDescriptor {
    
    readonly caption: string;
    readonly convertValue: FieldValueConverter;

    constructor(
            public readonly id: string, 
            public readonly description: string, 
            convertValue?: FieldValueConverter) {

        this.convertValue = convertValue ? convertValue : (fieldValue) => fieldValue;
        this.caption = id.substr(0, 1).toUpperCase() + id.substr(1, id.length - 1);
    }

    isMatch(value: string): boolean {
        return value.startsWith(this.id);
    }
}

const EqualsCriteria  = new PolicyCriteriaDescriptor("equals", "");
const LikeCriteria  = new PolicyCriteriaDescriptor("like", "");
const MatchCriteria  = new PolicyCriteriaDescriptor("match", "");
const ContainsCriteria  = new PolicyCriteriaDescriptor("contains", "");
const InCriteria  = new PolicyCriteriaDescriptor("in", "");
const ContainsKeyCriteria  = new PolicyCriteriaDescriptor("containsKey", "");
const ExistsCriteria  = new PolicyCriteriaDescriptor("exists", "", (v) => v === 'True' ? 'True' : 'False');

export const AvailableCriterias = {
    "Equals": EqualsCriteria,
    "Like": LikeCriteria,
    "Match": MatchCriteria,
    "Contains": ContainsCriteria,
    "In": InCriteria,
    "ContainsKey": ContainsKeyCriteria,
    "Exists": ExistsCriteria
}

export const AllCriterias = 
    Object.getOwnPropertyNames(AvailableCriterias)
    .map(c => AvailableCriterias[c] as IPolicyCriteriaDescriptor) as ReadonlyArray<IPolicyCriteriaDescriptor>;