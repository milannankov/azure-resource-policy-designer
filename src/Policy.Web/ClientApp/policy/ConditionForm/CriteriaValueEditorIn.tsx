import * as React from 'react';
import { CriteriaValue } from '../criteria';
import { MultiSelect } from '@progress/kendo-dropdowns-react-wrapper';

export interface Props {
    inValues: Array<string>;
    suggestedValues: Array<string>;
    onValueChanged(value: CriteriaValue);
}

export interface State {
}

export class CriteriaValueEditorIn extends React.Component<Props, State> {

    private widgetRef: MultiSelect;
    
    constructor(props: Props) {
        super(props);
    }

    render() {

        const dataArray = this.generateDataSource();

        return (
            <div>
                <MultiSelect
                    ref={(r) => this.widgetRef = r}
                    placeholder={'Select values...'}
                    dataSource={dataArray}
                    tagMode={'single'}
                    value={this.props.inValues || []} />
            </div>
        );
    }

    private generateDataSource() {
        const valueArray = this.props.inValues || [];
        const suggested = this.props.suggestedValues || [];
        const missing = valueArray.filter(i => suggested.indexOf(i) === -1);
        const dataArray = suggested.concat(missing);

        return dataArray;
    }

    componentDidMount() {
        this.widgetRef.widgetInstance.unbind("change", this.handleValueChanged);
        this.widgetRef.widgetInstance.bind("change", this.handleValueChanged);
        var multiSelect = this.widgetRef.widgetInstance as any;
        multiSelect.input.on('keydown', this.onInputKeyPress);
    }

    componentDidUpdate(prevProps, prevState) {
        this.widgetRef.widgetInstance.unbind("change", this.handleValueChanged);
        this.widgetRef.widgetInstance.bind("change", this.handleValueChanged);
    }

    componentWillUnmount() {
        this.widgetRef.widgetInstance.unbind("change", this.handleValueChanged);
        this.widgetRef.widgetInstance.unbind("change", this.handleValueChanged);
        var multiSelect = this.widgetRef.widgetInstance as any;
        multiSelect.input.off('keydown', this.onInputKeyPress);
    }

    onInputKeyPress = (e) => {
        if (e.key !== "Enter") {
            return;
        }

        var multiSelect = this.widgetRef.widgetInstance as any;
        var newValue = multiSelect.input.val();
        let value = new CriteriaValue(this.props.inValues.concat([newValue]));

        this.props.onValueChanged(value);
    }

    private handleValueChanged = (e) => {
        const selectedValues = e.sender.value() as Array<string>;
        let value = new CriteriaValue(selectedValues);

        this.props.onValueChanged(value);
    }
}
