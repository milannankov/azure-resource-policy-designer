import * as React from 'react';

export interface Props {
    criteriaValue: string;
    onValueChanged(value: string)
}

export interface State {
}

export class CriteriaValueEditorExpression extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
        }
    }

    render() {

        return (
            <textarea className="conditionInput simpleInputBox multiline"
                value={this.props.criteriaValue}
                onChange={this.textChanged}>
            </textarea>
        );
    }

    private textChanged = (event) => {
        this.props.onValueChanged(event.target.value.toString());
    }
}
