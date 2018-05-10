import * as React from 'react';
import { CommandsPaneItem } from './CommandsPaneItem';
import { CommandItem, CommandGroupItem, ExecutableCommandItem, isExecutable, isGroup } from './Items';
import * as classnames from 'classnames';
export * from './CommandsPaneItem';
export * from './Items';

export interface Props {
    commands: Array<CommandItem>;
    hidden: boolean;
    onCommandRequested: (command: CommandItem) => void;
}

export interface State {
    currentGroup: CommandGroupItem;
}

export class CommandsPane extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            currentGroup: null
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.hidden) {
            this.setState({
                currentGroup: null
            })
        }
    }

    render() {

        const paneClasses = classnames({
            'commandsPane': true,
            'shown': !this.props.hidden,
            'collapsed': this.props.hidden
        })

        const commands = this.state.currentGroup ? this.state.currentGroup.items : this.props.commands;

        return (
            <div className={paneClasses}>
                {commands.map(c =>
                    <CommandsPaneItem item={c} key={c.id} onCommandClicked={this.handleCommandItemClicked} />
                )}
            </div>
        );
    }

    private handleCommandItemClicked = (item: CommandItem) => {

        if (isGroup(item)) {
            this.setState({
                currentGroup: item
            })
        }
        else {
            this.props.onCommandRequested(item);
            this.setState({
                currentGroup: null
            })
        }
    }
}
