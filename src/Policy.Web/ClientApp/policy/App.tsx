import * as core from './core';
import * as React from 'react';
import { PolicyDesigner } from './PolicyDesigner/PolicyDesigner';
import * as fileSaver from 'file-saver';
import { classnames } from 'classnames';

export interface State {
    policyRule: core.PolicyRule | null;
    selectedValue: string;
    operationInProgess: boolean;
}

export interface Props {
}

export interface PolicyNodeOperations {
    updateCondition: (update: core.ConditionNodeUpdate) => void;
    updateEffect(newEffect: string);
    changeLogicalType: (node: core.PolicyRuleLogicalNode, newType: string) => void;
    deleteNode: (node: core.PolicyRuleNode) => void;
    addBefore: (node: core.PolicyRuleNode, reference: core.PolicyRuleNode) => void;
    addAfter: (node: core.PolicyRuleNode, reference: core.PolicyRuleNode) => void;
    addLast: (node: core.PolicyRuleNode, parent: core.PolicyRuleLogicalNode) => void;
    addFirst: (node: core.PolicyRuleNode, parent: core.PolicyRuleLogicalNode) => void;
    findNode: (nodeId: string) => core.PolicyRuleNode;
}

export class App extends React.Component<Props, State> {

    private nodeOperatons: PolicyNodeOperations;

    constructor(props: Props) {
        super(props);

        this.state = {
            policyRule: null,
            selectedValue: "one",
            operationInProgess: false
        }

        this.nodeOperatons = {
            addBefore: this.addBefore,
            addAfter: this.addAfter,
            addLast: this.addLast,
            addFirst: this.addFirst,
            changeLogicalType: this.hangleLogicalTypeChange,
            deleteNode: this.deleteNode,
            updateCondition: this.updateCondition,
            findNode: (nodeId) => this.state.policyRule.findNode(nodeId),
            updateEffect: this.updateEffect
        }
    }

    private getPolicy() {

        let global = window as any;

        return fetch(global.apiDetails.getPolicyEndpoint)
            .then((response) => response.json())
            .then((json) => {
                return json;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    private savePolicy() {

        let global = window as any;
        var json = this.state.policyRule.serializeToSchema();

        return fetch(global.apiDetails.savePolicyEndpoint, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "PolicyId": global.apiDetails.policyId,
                "PolicyText": JSON.stringify(json)
            })

        })
            .then((json) => {
                this.setState({
                    operationInProgess: false
                });
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    operationInProgess: false
                });
            });
    }

    private getSuggestedValues(fieldName: string): Promise<Array<string>> {

        let global = window as any;
        const url = global.apiDetails.getSuggestedValuesEndpoint + fieldName + ".json";

        return fetch(url)
            .then((response) => response.ok ? response.json() : [])
            .catch((error) => {
                return [];
            });
    }

    render() {

        if (!this.state.policyRule) {
            return (
                <div> No Policy </div>
            )
        }

        return (

            // const button

            <div className="appContent">
                <div className="header">
                    <h1 className="title">Azure Resource Policy Designer</h1>
                    <nav className="appNavigation">
                        <ul>
                            <li className="appNavigationItem"><a href="/">Home</a></li>
                            <li className="appNavigationItem"><a href="https://github.com/milannankov/azure-resource-policy-designer" target="_blank">Github</a></li>
                        </ul>
                    </nav>
                </div>
                <div className="designerHost">
                    <div className="mainActions">
                        <button className="mainActionButton" disabled={this.state.operationInProgess} onClick={this.handleExportClick}>Export</button>
                        <button className="mainActionButton" disabled={this.state.operationInProgess} onClick={this.handleSaveClick}>Save</button>
                    </div>
                    <PolicyDesigner
                        rule={this.state.policyRule}
                        suggestedValuesProvider={this.provideSuggestedValues}
                        nodeOperatons={this.nodeOperatons} />
                </div>
            </div>
        );
    }

    private handleSaveClick = (event) => {
        this.setState({
            operationInProgess: true
        });

        this.savePolicy();
    }

    private handleExportClick = (event) => {
        var json = this.state.policyRule.serializeToSchema();
        var file = new File([JSON.stringify(json)], "policy-rule.json", { type: "application/json;charset=utf-8" });
        fileSaver.saveAs(file);
    }

    private updateEffect = (newEffect: string) => {
        const policyCopy = this.state.policyRule.clone();
        policyCopy.changeEffect(newEffect);

        this.setState({
            policyRule: policyCopy
        });
    }

    private addBefore = (node: core.PolicyRuleNode, reference: core.PolicyRuleNode) => {
        const policyCopy = this.state.policyRule.clone();
        policyCopy.addBefore(node, reference.id);

        this.setState({
            policyRule: policyCopy
        });
    }

    private addAfter = (node: core.PolicyRuleNode, reference: core.PolicyRuleNode) => {
        const policyCopy = this.state.policyRule.clone();
        policyCopy.addAfter(node, reference.id);

        this.setState({
            policyRule: policyCopy
        })
    }

    private addLast = (node: core.PolicyRuleNode, parent: core.PolicyRuleLogicalNode) => {
        const policyCopy = this.state.policyRule.clone();
        policyCopy.addLast(node, parent.id);

        this.setState({
            policyRule: policyCopy
        })
    }

    private addFirst = (node: core.PolicyRuleNode, parent: core.PolicyRuleLogicalNode) => {
        const policyCopy = this.state.policyRule.clone();
        policyCopy.addFirst(node, parent.id);

        this.setState({
            policyRule: policyCopy
        })
    }

    private deleteNode = (node: core.PolicyRuleNode) => {
        const policyCopy = this.state.policyRule.clone();
        policyCopy.deleteNode(node.id);

        this.setState({
            policyRule: policyCopy
        })
    }

    private updateCondition = (update: core.ConditionNodeUpdate) => {
        const policyCopy = this.state.policyRule.clone();
        policyCopy.updateCondition(update);

        this.setState({
            policyRule: policyCopy
        })
    }

    private hangleLogicalTypeChange = (node: core.PolicyRuleLogicalNode, newType: string) => {
        const policyCopy = this.state.policyRule.clone();
        policyCopy.changeLogicalType(node, newType);

        this.setState({
            policyRule: policyCopy
        })
    }

    private replacer(key, value) {
        // Filtering out properties
        if (typeof value === 'string') {
            return undefined;
        }
        return value;
    }

    private onButton = () => {
        this.setState({

        });
    }

    provideSuggestedValues = (field: string): Promise<Array<string>> => {
        return this.getSuggestedValues(field)
            .then(json => {
                return Array.isArray(json) ? json as Array<string> : [];
            })
            .catch(e => {
                return [];
            })
    }

    componentDidMount() {
        this.getPolicy()
            .then(json => core.buildPolicyRule(json))
            .then(policyRule => {
                this.setState({
                    policyRule: policyRule
                });
            });
    }
}