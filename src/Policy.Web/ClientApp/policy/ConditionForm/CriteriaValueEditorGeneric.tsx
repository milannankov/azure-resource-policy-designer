import * as React from 'react';
import { CriteriaValue } from '../criteria';
import { ComboBox } from '@progress/kendo-dropdowns-react-wrapper';

export interface Props {
    criteriaValue: string;
    suggestedValues: Array<string>;
    onValueChanged(value: string);
}

export interface State {
}

export class CriteriaValueEditorGeneric extends React.Component<Props, State> {

    private comboRef: ComboBox;

    constructor(props: Props) {
        super(props);

        this.state = {
        }
    }

    render() {

        const options = {
            filter: "contains",
            height: 400,
            dataSource: {
                data: this.props.suggestedValues
            },
            value: this.props.criteriaValue
        }

        return (
            <div>
                <ComboBox {...options} ref={(r) => this.comboRef = r} />
            </div>
        );
    }

    private handleValueChanged = (e) => {
        this.props.onValueChanged(e.sender.value());
    }

    componentDidMount() {
        this.comboRef.widgetInstance.unbind("change", this.handleValueChanged);
        this.comboRef.widgetInstance.bind("change", this.handleValueChanged);
    }

    componentDidUpdate(prevProps, prevState) {
        this.comboRef.widgetInstance.unbind("change", this.handleValueChanged);
        this.comboRef.widgetInstance.bind("change", this.handleValueChanged);
    }

    componentWillUnmount() {
        this.comboRef.widgetInstance.unbind("change", this.handleValueChanged);
        this.comboRef.widgetInstance.unbind("change", this.handleValueChanged);
    }
}
