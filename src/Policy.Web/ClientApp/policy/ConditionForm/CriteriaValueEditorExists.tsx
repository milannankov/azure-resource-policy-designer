import * as React from 'react';

export interface Props {
    criteriaValue: string;
    onValueChanged(value: string)
}

export interface State {
}

export class CriteriaValueEditorExists extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
        }
    }

    render() {

        return (
            <div>
                <input type="radio" id="criteriaValue1" name="criteriaValue" value="True"
                    checked={this.props.criteriaValue === 'True'}
                    onChange={this.handleValueChanged} />
                <label htmlFor="criteriaValue1" className="radioLabel">True</label>

                <input type="radio" id="criteriaValue2" name="criteriaValue" value="False"
                    checked={this.props.criteriaValue === 'False'}
                    onChange={this.handleValueChanged} />
                <label htmlFor="criteriaValue2" className="radioLabel">False</label>
            </div>
        );
    }

    private handleValueChanged = (event) => {
        this.props.onValueChanged(event.target.value);
    }
}
