import * as React from 'react';
import * as core from './core';

export interface Props {
    node: core.PolicyRuleConditionNode;
}

export class ConditionNodeHeader extends React.PureComponent<Props, any> {
    render() {
        return (
            <div className="conditionNode">
                <div className="conditionNodeHeader">
                    <div className="policyNodeIcon"><i className="fal fa-file-alt"></i></div>
                    <div className="conditionNodeHeaderContent">
                        <div className="conditionNodeField">{this.props.node.conditionField}</div>
                        <div className="conditionNodeOperator">{this.props.node.conditionType}</div>
                        <div className="conditionNodeValue">{this.props.node.conditionValue.toString()}</div>
                    </div>
                </div>
            </div>
        );
    }
}
