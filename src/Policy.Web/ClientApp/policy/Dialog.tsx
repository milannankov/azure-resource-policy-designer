import * as React from 'react';
import * as core from './core';
import '@progress/kendo-ui';
import { Window } from '@progress/kendo-window-react-wrapper';

export interface Props {
    show: boolean;
    title: string;
}

export interface State {
}

export class Dialog extends React.Component<Props, State> {

    private windowRef: Window;

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <Window title={this.props.title}
                ref={this.getRef}
                actions={[]}
                resizable={false}
                scrollable={false}
                position={{ top: "20%", left: "35%" }}
                modal={true} width="650" height="400"
                visible={false}
                draggable={false} pinned={true}>
                    {this.props.show && this.props.children}
            </Window>
        );
    }

    getRef = (w) => {
        this.windowRef = w;
    }

    componentDidUpdate(pr, st) {

        if (pr.show === this.props.show) {
            return;
        }

        let instance = this.windowRef.widgetInstance as any;
        this.props.show ?
            instance.open() :
            instance.close();
    }
}

export default Dialog;