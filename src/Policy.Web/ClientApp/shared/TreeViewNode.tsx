import * as React from 'react';
import * as classnames from 'classnames';

export interface TreeViewNodeData {
  // hasChildren: boolean;
  children: Array<any>;
  key: string;
}

export interface Props {
  dataItem: any;
  onActivated: (node: TreeViewNode) => void;
  onDeactivated: (node: TreeViewNode) => void;
  renderHeader: (dataItem: any) => JSX.Element;
  getNodeData: (dataItem: any) => TreeViewNodeData;
}

export interface State {
  expanded: boolean;
  activated: boolean;
}

export class TreeViewNode extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      expanded: true,
      activated: false
    }
  }

  render() {

    const nodeData = this.props.getNodeData(this.props.dataItem);
    const hasChildren = nodeData.children != null && nodeData.children.length > 0;
    const headerContent = (
      <div className="treeViewHeaderContent" onClick={this.handleHeaderClicked}>
        {this.props.renderHeader(this.props.dataItem)}
      </div>
    )

    let expanderClassnames = classnames({
      treeViewNodeExpander: true,
      noChildren: !hasChildren
    });

    return (
      <div className={this.state.activated ? 'treeViewNode active' : 'treeViewNode'}>
        <div className="treeViewHeader">
          <div className={expanderClassnames} onClick={this.handleExpanderClicked}>
            {this.state.expanded && <span className="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>}
            {!this.state.expanded && <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>}
          </div>
          {headerContent}
        </div>
        {this.renderChildren(nodeData.children)}
      </div>
    );
  }

  private renderChildren(children) {
    children = children || [];
    const hasChildren = children.length > 0;

    if (children.length <= 0) {
      return null;
    }

    return (
      <div className={this.state.expanded ? 'treeViewChildren' : 'treeViewChildren collapsed'}>
        {children.map(c => {
          let data = this.props.getNodeData(c);
          return <TreeViewNode dataItem={c}
            key={data.key}
            onActivated={this.props.onActivated}
            onDeactivated={this.props.onDeactivated}
            getNodeData={this.props.getNodeData}
            renderHeader={this.props.renderHeader} />
        })}
      </div>
    )
  }

  private handleExpanderClicked = () => {
    this.toggleExpanded();
  }

  public toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  public toggleActivated = () => {
    this.setState({
      activated: !this.state.activated
    })
  }

  public deactivate = () => {
    this.setState({
      activated: false
    });
  }

  private handleHeaderClicked = (e) => {
    const hasActivated = !this.state.activated;
    this.toggleActivated();

    if (hasActivated) {
      this.props.onActivated(this);
    }
    else {
      this.props.onDeactivated(this);
    }
  }
}
