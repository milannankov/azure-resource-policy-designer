import * as React from 'react';
import * as core from './core';

export interface Props {
    node: core.PolicyRuleLogicalNode;
    onTypeChange: (logicalType: string, node: core.PolicyRuleLogicalNode) => void;
}

export class LogicalNodeHeader extends React.PureComponent<Props, any> {
    render() {

        const content = this.props.node.canChangeType() ?
            <div className="logicalNodeValueSelector">
                <select value={this.props.node.logicalType.toString()} onChange={this.handleChange} onClick={this.onClick}>
                    <option value="allof">All of</option>
                    <option value="anyof">Any of</option>
                    <option value="not">Not</option>
                </select>
            </div> :
            <div>If</div>

        return (
            <div className="logicalNode">
                <div className="logicalNodeHeader">
                    <div className="policyNodeIcon"><i className="fal fa-sitemap"></i></div>
                    <div className="logicalNodeHeaderContent">
                        {content}
                    </div>
                </div>
            </div>
        );
    }

    private handleChange = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.onTypeChange(event.target.value, this.props.node);
    }

    private onClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }
}
