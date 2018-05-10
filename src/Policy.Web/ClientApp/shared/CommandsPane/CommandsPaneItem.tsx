import * as React from 'react';
import { CommandItem, CommandGroupItem, ExecutableCommandItem, isExecutable, isGroup } from './Items';

export interface Props {
    item: CommandItem;
    onCommandClicked: (item: CommandItem) => void;
}

export class CommandsPaneItem extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);
    }

    render() {

        let shortcut = isExecutable(this.props.item) ? <span className="commandsPaneShortcut">{this.props.item.shortcut}</span> : null;

        return (
            <div className="commandsPaneItem" onClick={this.onClicked}>
                <span className="commandsPaneCaption">{this.props.item.caption}</span>
                <div className="commandsPaneIcon">
                    <i className={this.props.item.iconCssClasses}></i>
                </div>
                {shortcut}
            </div>
        );
    }

    private onClicked = (event) => {
        this.props.onCommandClicked(this.props.item);
    }
}
