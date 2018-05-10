import * as React from 'react';
import { DropDownList } from '@progress/kendo-dropdowns-react-wrapper';
import { IPolicyCriteriaDescriptor } from '../criteria';

export interface Props {
    criteriaType: IPolicyCriteriaDescriptor;
    availableCriterias: ReadonlyArray<IPolicyCriteriaDescriptor>;
    onTypeChanged(value: IPolicyCriteriaDescriptor);
}

export interface State {

}

export class CriteriaTypeSelector extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
        }
    }

    render() {

        const options = {
            filter: "contains",
            dataTextField: "caption",
            dataValueField: "id",
            height: 600,
            dataSource: {
                data: this.props.availableCriterias
            },
            value: this.props.criteriaType.id,
            select: this.onSelection
        }

        return (
            <div className="inputLine">
                <DropDownList {...options} />
            </div>
        );
    }

    private onSelection = (e) => {
        var descriptor = e.dataItem as IPolicyCriteriaDescriptor;

        this.props.onTypeChanged(descriptor);
    }
}