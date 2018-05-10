import * as React from 'react';
import { TreeViewNode, TreeViewNodeData } from './TreeViewNode';
export * from './TreeViewNode';

export interface Props {
    dataSource: any;
    renderHeader: (dataItem: any) => JSX.Element;
    getNodeData: (dataItem: any) => TreeViewNodeData;
    onNodeActivated: (node: TreeViewNode) => void;
    onNodeDeactivated: (node: TreeViewNode) => void;
}

export interface State {
}

export class TreeView extends React.Component<Props, State> {

    private activatedNode: TreeViewNode = null;

    constructor(props: Props) {
        super(props);

        this.state = {
        }
    }

    render() {

        var items = Array.isArray(this.props.dataSource) ? this.props.dataSource : [this.props.dataSource];

        return (
            <div className="treeView">

                {items.map(i => {
                    let nodeData = this.props.getNodeData(i);
                    return <TreeViewNode dataItem={i}
                        key={nodeData.key}
                        getNodeData={this.props.getNodeData}
                        renderHeader={this.props.renderHeader}
                        onActivated={this.handleOnActivated}
                        onDeactivated={this.handleDeactivated} />
                }
                )}
            </div>
        );
    }

    private handleOnActivated = (node: TreeViewNode) => {

        if (this.activatedNode) {
            this.activatedNode.deactivate();
        }

        this.activatedNode = node;
        this.props.onNodeActivated(node);
    }

    private handleDeactivated = (node: TreeViewNode) => {
        this.activatedNode = null;
        this.props.onNodeDeactivated(node);
    }

    private renderChild = (dataItem: any) => {

    }
}
