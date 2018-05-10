import * as core from '../core';
import { KnownFields } from '../fields';
import { IPolicyCriteriaDescriptor, AllCriterias } from '../criteria';
import * as React from 'react';
import { LogicalNodeHeader } from '../LogicalNodeHeader';
import { ConditionNodeHeader } from '../ConditionNodeHeader';
import { Dialog } from '../Dialog';
import { ConditionForm } from '../ConditionForm/ConditionForm';
import * as tree from '../../shared/TreeView';
import { CommandsPane, CommandItem } from '../../shared/CommandsPane/CommandsPane';
import { getCommandsForNode } from './NodeCommands';
import { PolicyNodeOperations } from '../App';

export interface Props {
    rule: core.PolicyRule;
    nodeOperatons: PolicyNodeOperations;
    suggestedValuesProvider: (field: string) => Promise<Array<string>>;
}

export interface State {
    conditionToEdit: core.PolicyRuleConditionNode;
    activeNode: core.PolicyRuleNode;
    copiedNode: core.PolicyRuleNode;
}

export class PolicyDesigner extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            conditionToEdit: null,
            activeNode: null,
            copiedNode: null
        };
    }

    render() {

        let nodeCommands = getCommandsForNode(this.state.activeNode, this.state.copiedNode != null);

        return (
            <div className="policyDesigner">
                <CommandsPane commands={nodeCommands} hidden={this.state.activeNode == null} onCommandRequested={this.handleOnCommandRequested} />
                <Dialog title="Edit Condition"
                    show={this.state.conditionToEdit !== null}>
                    <ConditionForm condition={this.state.conditionToEdit}
                        suggestedValuesProvider={this.props.suggestedValuesProvider}
                        onCancelEdit={this.handleCancelEdit}
                        onConditionUpdated={this.handleCommitEdit}
                        knownFields={KnownFields}
                        listOfCriterias={AllCriterias} />
                </Dialog>
                <div className="policySection">
                    <span className="policySectionTitle">Policy Effect</span>
                    <span className="policySectionInfo">The effect specifies what happens when the If conditions are fulfilled.</span>
                    <div>
                        <select value={this.props.rule.then.effect} onChange={this.handleEffectChange}>
                            <option value="deny">Deny</option>
                            <option value="audit">Audit</option>
                            <option value="auditifnotexists">AuditIfNotExists</option>
                        </select>
                    </div>
                </div>

                <div className="policySection">
                    <span className="policySectionTitle">Policy If</span>
                    <span className="policySectionInfo">In the If block, you define one or more conditions that are evaluated.</span>
                    <tree.TreeView dataSource={this.props.rule.if}
                        getNodeData={this.getTreeNodeData}
                        renderHeader={this.renderTreeHeader}
                        onNodeActivated={this.handleNodeActivated}
                        onNodeDeactivated={this.handleNodeDeactivated} />
                </div>
                {/* <div>Then - {this.props.rule.then.effect}</div> */}
            </div>
        );
    }

    private handleEffectChange = (event) => {
        this.props.nodeOperatons.updateEffect(event.target.value);
    }

    componentWillReceiveProps(nextProps: Props) {

        if (this.state.activeNode) {
            this.setState({
                activeNode: this.props.nodeOperatons.findNode(this.state.activeNode.id)
            })
        }

    }

    readonly commandHandlers = {
        "delete": () => {
            this.props.nodeOperatons.deleteNode(this.state.activeNode);
            this.setState({
                activeNode: null
            })
        },
        "copy": () => {
            this.setState({
                copiedNode: core.cloneNode(this.state.activeNode)
            })
        },
        "cut": () => {
            var node = this.props.nodeOperatons.deleteNode(this.state.activeNode);
            this.setState({
                copiedNode: core.cloneNode(this.state.activeNode)
            })
        },
        "edit": () => {
            if (core.isCondition(this.state.activeNode)) {
                this.beginEditingCondition(this.state.activeNode)
            }
        },
        "paste-above": () => {

            if (!this.state.copiedNode || !this.state.activeNode) {
                return;
            }

            const cloned = core.cloneNode(this.state.copiedNode);
            this.props.nodeOperatons.addBefore(cloned, this.state.activeNode);
        },
        "paste-below": () => {

            if (!this.state.copiedNode || !this.state.activeNode) {
                return;
            }

            const cloned = core.cloneNode(this.state.copiedNode);
            this.props.nodeOperatons.addAfter(cloned, this.state.activeNode);
        },
        "paste-child-top": () => {

            if (!this.state.copiedNode || !this.state.activeNode || !core.isLogical(this.state.activeNode)) {
                return;
            }

            const cloned = core.cloneNode(this.state.copiedNode);
            this.props.nodeOperatons.addFirst(cloned, this.state.activeNode as core.PolicyRuleLogicalNode);
        },
        "paste-child-bottom": () => {

            if (!this.state.copiedNode || !this.state.activeNode || !core.isLogical(this.state.activeNode)) {
                return;
            }

            const cloned = core.cloneNode(this.state.copiedNode);
            this.props.nodeOperatons.addLast(cloned, this.state.activeNode as core.PolicyRuleLogicalNode);
        },

        "add-logical-above": () => {

            if (!this.state.activeNode) {
                return;
            }

            this.props.nodeOperatons.addBefore(core.createNewLogical(), this.state.activeNode);
        },
        "add-logical-below": () => {

            if (!this.state.activeNode) {
                return;
            }

            this.props.nodeOperatons.addAfter(core.createNewLogical(), this.state.activeNode);
        },
        "add-logical-child-top": () => {

            if (!this.state.activeNode || !core.isLogical(this.state.activeNode)) {
                return;
            }

            this.props.nodeOperatons.addFirst(core.createNewLogical(), this.state.activeNode as core.PolicyRuleLogicalNode);
        },
        "add-logical-child-bottom": () => {

            if (!this.state.activeNode || !core.isLogical(this.state.activeNode)) {
                return;
            }

            this.props.nodeOperatons.addLast(core.createNewLogical(), this.state.activeNode as core.PolicyRuleLogicalNode);
        },

        "add-condition-above": () => {

            if (!this.state.activeNode) {
                return;
            }

            this.props.nodeOperatons.addBefore(core.createNewCondition(), this.state.activeNode);
        },
        "add-condition-below": () => {

            if (!this.state.activeNode) {
                return;
            }

            this.props.nodeOperatons.addAfter(core.createNewCondition(), this.state.activeNode);
        },
        "add-condition-child-top": () => {

            if (!this.state.activeNode || !core.isLogical(this.state.activeNode)) {
                return;
            }

            this.props.nodeOperatons.addFirst(core.createNewCondition(), this.state.activeNode as core.PolicyRuleLogicalNode);
        },
        "add-condition-child-bottom": () => {

            if (!this.state.activeNode || !core.isLogical(this.state.activeNode)) {
                return;
            }

            this.props.nodeOperatons.addLast(core.createNewCondition(), this.state.activeNode as core.PolicyRuleLogicalNode);
        }
    }

    private processCommand(id: string) {
        const handler = this.commandHandlers[id];

        if (!handler) {
            throw new Error("Handler for command not found");
        }

        handler();
    }

    private handleOnCommandRequested = (command: CommandItem) => {
        this.processCommand(command.id);
    }

    private handleNodeActivated = (node: tree.TreeViewNode) => {

        this.setState({
            activeNode: node.props.dataItem as core.PolicyRuleNode
        });
    }

    private handleNodeDeactivated = (node: tree.TreeViewNode) => {
        this.setState({
            activeNode: null
        });
    }

    private getTreeNodeData = (dataItem: core.PolicyRuleNode): tree.TreeViewNodeData => {
        if (core.isLogical(dataItem)) {
            return {
                children: dataItem.children,
                key: dataItem.id
            }
        }
        else {
            return {
                children: null,
                key: dataItem.id
            }
        }
    }

    private renderTreeHeader = (dataItem: core.PolicyRuleNode): JSX.Element => {
        return core.isLogical(dataItem)
            ? <LogicalNodeHeader
                node={dataItem}
                onTypeChange={this.handleLogicalNodeTypeChange} />
            : <ConditionNodeHeader node={dataItem as core.PolicyRuleConditionNode} />
    }

    private handleCommitEdit = (update: core.ConditionNodeUpdate) => {
        this.setState({
            conditionToEdit: null
        });

        this.props.nodeOperatons.updateCondition(update);
    }

    private handleCancelEdit = () => {
        this.setState({
            conditionToEdit: null
        });
    }

    private beginEditingCondition = (condition: core.PolicyRuleConditionNode) => {
        this.setState({
            conditionToEdit: condition
        });
    }

    private handleLogicalNodeTypeChange = (logicalType: string, node: core.PolicyRuleLogicalNode) => {
        this.props.nodeOperatons.changeLogicalType(node, logicalType);
    }
}
