import * as React from 'react';
import * as fields from '../fields';
import { IPolicyCriteriaDescriptor, CriteriaValue } from '../criteria';
import { ComboBox } from '@progress/kendo-dropdowns-react-wrapper';
import * as classnames from 'classnames';
import { CriteriaValueEditorExpression } from './CriteriaValueEditorExpression';
import { CriteriaValueEditorGeneric } from './CriteriaValueEditorGeneric';
import { CriteriaValueEditorExists } from './CriteriaValueEditorExists';
import { CriteriaValueEditorIn } from './CriteriaValueEditorIn';

export interface Props {
    criteriaValue: CriteriaValue;
    fieldValue: fields.FieldValue;
    criteriaType: IPolicyCriteriaDescriptor;
    suggestedValues: Array<string>;
    onValueChanged(value: CriteriaValue)
}

export interface State {
    expressionEditor: boolean;
}

export class CriteriaValueEditor extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            expressionEditor: props.criteriaValue.isExpression
        }
    }

    render() {

        let toggleClassNames = classnames({
            'formEditorToggle': true,
            'active': this.state.expressionEditor
        });

        return (

            <div className="formEditorContent">
                <div className="formEditorMainContainer inputLine">
                    {this.getEditor()}
                </div>
                <div className="formEditorToggleContainer top">
                    <button className={toggleClassNames} onClick={this.onExpressionClicked}></button>
                </div>
            </div>
        );
    }

    private getEditor() {

        const stringValue = this.props.criteriaValue.value.toString();

        if (this.state.expressionEditor) {
            return (
                <CriteriaValueEditorExpression
                    onValueChanged={this.onTextAreaChanged}
                    criteriaValue={stringValue} />
            );
        }

        if (this.props.criteriaType.id === "in") {
            return (
                <CriteriaValueEditorIn
                    onValueChanged={this.onCriteriaChanged}
                    suggestedValues={this.props.suggestedValues}
                    inValues={this.props.criteriaValue.isArray ? this.props.criteriaValue.value as Array<string> : []} />
            );
        }

        if (this.props.criteriaType.id === "exists") {
            return (
                <CriteriaValueEditorExists
                    onValueChanged={this.onTextAreaChanged}
                    criteriaValue={stringValue} />
            );
        }

        return (
            <CriteriaValueEditorGeneric
                onValueChanged={this.onTextAreaChanged}
                suggestedValues={this.props.suggestedValues}
                criteriaValue={stringValue} />
        );
    }

    private onExpressionClicked = (e) => {

        this.setState({
            expressionEditor: !this.state.expressionEditor
        });
    }

    private onCriteriaChanged = (newValue: CriteriaValue) => {
        this.props.onValueChanged(newValue);
    }

    private onTextAreaChanged = (newValue: string) => {
        this.props.onValueChanged(new CriteriaValue(newValue));
    }
}
