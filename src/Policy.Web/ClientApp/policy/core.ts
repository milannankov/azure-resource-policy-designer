function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

var LoggicalToExportMapping = new Map([
    ['not', 'not'],
    ['allof', 'allOf'],
    ['anyof', 'anyOf'],
    ['if', 'if'],
]);

export class PolicyRule {

    if: PolicyRuleIfNode;

    constructor(public id: string, public then: PolicyRuleThen, iff: PolicyRuleIfNode) {
        this.if = iff;
    }

    public updateCondition = (update: ConditionNodeUpdate) => {
        let target = findNode(update.nodeId, this.if);

        if (!isCondition(target)) {
            return;
        }

        target.conditionField = update.conditionField;
        target.conditionType = update.conditionType;
        target.conditionValue = update.conditionValue;
    }

    public serializeToSchema() {
        return {
            "then": {
                "effect": this.then.effect
            },
            "if": this.serializeNodeToSchema(this.if.children[0])
        }
    }

    private serializeNodeToSchema(node: PolicyRuleNode) {
        if (node == null) {
            return {};
        }

        if (isLogical(node)) {
            return this.serializeLogicalToSchema(node);
        }

        if (isCondition(node)) {
            return this.serializeConditionToSchema(node);
        }

        return {};
    }

    private serializeLogicalToSchema(node: PolicyRuleLogicalNode) {
        if (node == null) {
            return {};
        }

        let logical = {};

        if(node.logicalType === "not") {
            logical["not"] = this.serializeNodeToSchema(node.children[0]);
        }
        else {
            let children = node.children.map(c => this.serializeNodeToSchema(c));
            let logicalKey = LoggicalToExportMapping.get(node.logicalType);
            logical[logicalKey] = children;
        }

        return logical;
    }

    private serializeConditionToSchema(node: PolicyRuleConditionNode) {
        if (node == null) {
            return {};
        }

        let condition = {
            "field": node.conditionField,
        }

        condition[node.conditionType] = node.conditionValue;

        return condition;
    }

    public changeEffect(newEffect: string) {
        this.then.effect = newEffect;
    }

    public changeLogicalType = (node: PolicyRuleLogicalNode, newType: string) => {
        let target = findNode(node.id, this.if);

        if (!isLogical(target)) {
            return;
        }

        target.logicalType = newType;

        if (newType === 'not' && target.children.length > 1) {
            target.children.splice(1, target.children.length - 1);
        }
    }

    public addAfter(node: PolicyRuleNode, referenceId: string) {
        this.verifyNewNode(node);
        const reference = findNode(referenceId, this.if);

        if (!reference) {
            return;
        }

        reference.parent.addAfter(node, referenceId);
    }

    public addBefore(node: PolicyRuleNode, referenceId: string) {
        this.verifyNewNode(node);
        const reference = findNode(referenceId, this.if);

        if (!reference) {
            return;
        }

        reference.parent.addBefore(node, referenceId);
    }

    public addFirst(node: PolicyRuleNode, parentId: string) {
        this.verifyNewNode(node);
        const parent = findNode(parentId, this.if) as PolicyRuleLogicalNode;

        if (!parent) {
            return;
        }

        parent.addFirst(node);
    }

    public addLast(node: PolicyRuleNode, parentId: string) {
        this.verifyNewNode(node);
        const parent = findNode(parentId, this.if) as PolicyRuleLogicalNode;

        if (!parent) {
            return;
        }

        parent.addLast(node);
    }

    private verifyNewNode(node: PolicyRuleNode) {
        const existingNode = findNode(node.id, this.if);

        if (existingNode) {
            throw new Error("Node already in tree");
        }
    }

    private verifyParentNode(reference: PolicyRuleNode) {
        const existingReference = findNode(reference.id, this.if);

        if (!existingReference) {
            throw new Error("Reference node not in tree");
        }
    }

    public deleteNode(nodeId: string) {
        const target = findNode(nodeId, this.if);

        if (target == null || target.parent == null) {
            return
        }

        const targetIndex = target.parent.children.findIndex(n => n.id === nodeId);
        target.parent.children.splice(targetIndex, 1);
    }

    public clone(): PolicyRule {
        return new PolicyRule(this.id, this.then, cloneIfNode(this.if, false));
    }

    public findNode(id: string) {
        return findNode(id, this.if);
    }
}

export interface PolicyRuleThen {
    effect: string;
}

export interface ConditionNodeUpdate {
    nodeId: string,
    parentId: string,
    conditionType: string,
    conditionValue: any,
    conditionField: string
}

export abstract class PolicyRuleNode {
    public nodeType: string;
    public parent: PolicyRuleLogicalNode;

    constructor(public id: string) {
        this.nodeType = this.getNodeType();
        this.parent = null;
    }

    protected abstract getNodeType(): string;
}

export class PolicyRuleConditionNode extends PolicyRuleNode {

    constructor(id: string,
        public conditionType: string,
        public conditionValue: any,
        public conditionField: string) {
        super(id);
    }

    protected getNodeType() {
        return "condition";
    }
}

//TODO: refactor to immutable
export class PolicyRuleLogicalNode extends PolicyRuleNode {

    public children: Array<PolicyRuleNode> = [];

    constructor(id: string,
        public logicalType: string,
        initialChildren: Array<PolicyRuleNode>) {
        super(id);

        const finalChildren = initialChildren || [];
        finalChildren.forEach(c => {
            this.addLast(c);
        })
    }

    protected getNodeType() {
        return "logical";
    }

    public canChangeType() {
        return true;
    }

    private canAddNode(node: PolicyRuleNode): boolean {
        return node != null &&
            node.parent == null &&
            this.acceptsAdditionalChildren();
    }

    public acceptsAdditionalChildren() {
        return this.logicalType != "not" || this.children.length === 0
    }

    public addAfter(node: PolicyRuleNode, referenceId: string) {
        const index = this.getChildIndex(referenceId);

        if (index < 0 || !this.canAddNode(node)) {
            return;
        }

        this.addChild(node, index + 1);
    }

    public addBefore(node: PolicyRuleNode, referenceId: string) {
        const index = this.getChildIndex(referenceId);

        if (index < 0 || !this.canAddNode(node)) {
            return;
        }

        this.addChild(node, index);
    }

    public addFirst(node: PolicyRuleNode) {
        if (!this.canAddNode(node)) {
            return;
        }

        this.addChild(node, 0);
    }

    public addLast(node: PolicyRuleNode) {
        if (!this.canAddNode(node)) {
            return;
        }

        this.addChild(node, this.children.length);
    }

    public getChildIndex(id: string) {
        return this.children.findIndex(n => n.id === id);
    }

    private addChild(node: PolicyRuleNode, index: number) {
        this.children.splice(index, 0, node);
        node.parent = this;
    }
}

export class PolicyRuleIfNode extends PolicyRuleLogicalNode {
    constructor(id: string, child: PolicyRuleNode) {
        super(id, "if", child ? [child] : null);
    }

    public canChangeType() {
        return false;
    }

    public acceptsAdditionalChildren() {
        return this.children.length === 0
    }
}

export function isLogical(node: PolicyRuleNode): node is PolicyRuleLogicalNode {
    return node != null && node.nodeType === "logical";
}

export function isCondition(node: PolicyRuleNode): node is PolicyRuleConditionNode {
    return node != null && node.nodeType === "condition";
}

export function cloneNode(node: PolicyRuleNode, generateNewIds: boolean = true): PolicyRuleNode {

    if (isLogical(node)) {
        return cloneLogicalNode(node, generateNewIds);
    }
    else {
        return cloneConditonNode(node as PolicyRuleConditionNode, generateNewIds);
    }
}

function cloneLogicalNode(original: PolicyRuleLogicalNode, generateNewIds: boolean): PolicyRuleLogicalNode {
    const id = generateNewIds ? uuidv4() : original.id;
    let cloned = new PolicyRuleLogicalNode(id, original.logicalType, []);
    let children = original.children as Array<any>;

    children.forEach(c => {
        cloned.addLast(cloneNode(c, generateNewIds));
    });

    return cloned;
}

function cloneIfNode(original: PolicyRuleIfNode, generateNewIds: boolean): PolicyRuleLogicalNode {
    const id = generateNewIds ? uuidv4() : original.id;
    let cloned = new PolicyRuleIfNode(id, null);
    let children = original.children as Array<any>;

    children.forEach(c => {
        cloned.addLast(cloneNode(c, generateNewIds));
    });

    return cloned;
}

function cloneConditonNode(original: PolicyRuleConditionNode, generateNewIds: boolean): PolicyRuleConditionNode {
    const id = generateNewIds ? uuidv4() : original.id;
    return new PolicyRuleConditionNode(id, original.conditionType, original.conditionValue, original.conditionField)
}

//TODO combine build and clone by using higher order functions

export function buildPolicyRule(json: any): PolicyRule {

    const ifNode = new PolicyRuleIfNode(uuidv4(), buildPolicyRuleNode(json.if, null));

    return new PolicyRule(json.id, json.then, ifNode);
}

function buildPolicyRuleNode(json: any, parent: PolicyRuleLogicalNode): PolicyRuleNode {

    if (isLogical(json)) {
        return buildPolicyRuleLogicalNode(json, parent);
    }
    else {
        return buildPolicyRuleConditonNode(json);
    }
}

function buildPolicyRuleLogicalNode(json: any, parent): PolicyRuleLogicalNode {

    let node = new PolicyRuleLogicalNode(json.id, json.logicalType, []);
    let children = json.children as Array<any>;

    children.forEach(c => {
        node.addLast(buildPolicyRuleNode(c, node));
    });

    return node;
}

function buildPolicyRuleConditonNode(json: any): PolicyRuleConditionNode {
    return new PolicyRuleConditionNode(json.id, json.conditionType, json.conditionValue, json.conditionField)
}

export function createNewLogical() {
    return new PolicyRuleLogicalNode(uuidv4(), "allof", []);
}

export function createNewCondition() {
    return new PolicyRuleConditionNode(uuidv4(), "equals", "my value", "field")
}

export function findNode(targetNodeId: string, root: PolicyRuleNode): PolicyRuleNode {

    if (root == null) {
        return null;
    }

    if (root.id === targetNodeId) {
        return root;
    }

    const children = isLogical(root) ? root.children : [];
    let found = null;

    for (let node of children) {
        found = findNode(targetNodeId, node);

        if (found) {
            break;
        }
    }

    return found;
}

export enum LogicalType {
    not, anyOf, allOf
}

export type ConditionValue = string | Array<string>;