import * as React from 'react';
import * as core from '../core';
import { IKnownPolicyField, FieldValue } from '../fields';
import { IPolicyCriteriaDescriptor, CriteriaValue } from '../criteria';
import '@progress/kendo-ui';
import { DropDownList } from '@progress/kendo-dropdowns-react-wrapper';
import * as classnames from 'classnames';
import { PolicyFieldEditor } from './PolicyFieldEditor';
import { CriteriaTypeSelector } from './CriteriaTypeSelector';
import { CriteriaValueEditor } from './CriteriaValueEditor';

export interface Props {
    condition: core.PolicyRuleConditionNode;
    knownFields: ReadonlyArray<IKnownPolicyField>;
    listOfCriterias: ReadonlyArray<IPolicyCriteriaDescriptor>;
    onCancelEdit: () => void;
    suggestedValuesProvider: (field: string) => Promise<Array<string>>;
    onConditionUpdated: (update: core.ConditionNodeUpdate) => void;
}

export interface State {
    currentField: FieldValue;
    currentFieldSuggerstedValues: Array<string>;
    currentCriteriaValue: CriteriaValue;
    currentCriteriaType: IPolicyCriteriaDescriptor;
}

export class ConditionForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
 
        this.state = this.stateForProps(props);
    }

    private stateForProps(props: Props): State {
        return {
            currentField: props.condition ? new FieldValue(props.condition.conditionField) : FieldValue.empty(),
            currentCriteriaValue: props.condition ? new CriteriaValue(props.condition.conditionValue) : CriteriaValue.empty(),
            currentCriteriaType: this.getDescriptorForCriteria(props.condition),
            currentFieldSuggerstedValues: []
        };
    }

    private getDescriptorForCriteria(conditionNode: core.PolicyRuleConditionNode): IPolicyCriteriaDescriptor {
        return conditionNode ?
            this.props.listOfCriterias.find(c => c.id === conditionNode.conditionType)
            : null;
    }

    render() {
        return (
            <div className="conditionForm">
                {this.renderCondition()}
                <div className="conditionFormButtons">
                    <div className="k-edit-buttons k-state-default">
                        <a role="button" className="k-button k-button-icontext k-primary k-grid-update" href="#" onClick={this.onUpdateClicked}>
                            <span className="k-icon k-i-check"></span>Update
                        </a>
                        <a role="button" className="k-button k-button-icontext k-grid-cancel" href="#" onClick={this.onCancelClicked}>
                            <span className="k-icon k-i-cancel"></span>Cancel
                    </a>
                    </div>
                </div>
            </div>
        );
    }

    onCancelClicked = (e) => {
        e.preventDefault();
        this.props.onCancelEdit();
    }

    onUpdateClicked = (e) => {
        e.preventDefault();
        const update = {
            nodeId: this.props.condition.id,
            parentId: this.props.condition.parent.id,
            conditionField: this.state.currentField.value,
            conditionValue: this.state.currentCriteriaValue.value,
            conditionType: this.state.currentCriteriaType.id
        }

        this.props.onConditionUpdated(update);
    }

    componentDidMount() {
        this.updateSuggestedValuesIfNeeded(new FieldValue(""), this.state.currentField)
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState(this.stateForProps(nextProps));
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        this.updateSuggestedValuesIfNeeded(prevState.currentField, this.state.currentField)
    }

    private updateSuggestedValuesIfNeeded(previousField: FieldValue, currentField: FieldValue) {
        if (previousField.value === currentField.value) {
            return;
        }

        this.props.suggestedValuesProvider(currentField.value)
            .then(values => {
                this.setState({
                    currentFieldSuggerstedValues: values
                })
            })
    }

    private renderCondition() {
        if (!this.props.condition) {
            return null;
        }

        return (
            <div className="conditionFormElements">
                <div className="conditionFormLabel">
                    <span className="inputLine-Label">Field</span>
                </div>
                <div className="conditionFormEditor">
                    <PolicyFieldEditor
                        fieldValue={this.state.currentField}
                        knownFields={this.props.knownFields}
                        onFieldChanged={this.handleFieldChanged} />
                </div>
                <div className="conditionFormLabel">
                    <span className="inputLine-Label">Creteria</span>
                </div>
                <div className="conditionFormEditor">
                    <CriteriaTypeSelector
                        criteriaType={this.state.currentCriteriaType}
                        availableCriterias={this.props.listOfCriterias}
                        onTypeChanged={this.handleTypeChanged} />
                </div>
                <div className="conditionFormLabel">
                    <span className="inputLine-Label">Value</span>
                </div>
                <div className="conditionFormEditor">
                    <CriteriaValueEditor
                        criteriaValue={this.state.currentCriteriaValue}
                        criteriaType={this.state.currentCriteriaType}
                        fieldValue={this.state.currentField}
                        suggestedValues={this.state.currentFieldSuggerstedValues}
                        onValueChanged={this.handleCriteriaValueChange} />
                </div>
            </div>
        );
    }

    private handleCriteriaValueChange = (value: CriteriaValue) => {
        this.setState({
            currentCriteriaValue: value
        });
    }

    private handleFieldChanged = (value: string) => {

        this.setState({
            currentField: new FieldValue(value),
        });
    }

    private handleTypeChanged = (condition: IPolicyCriteriaDescriptor) => {

        this.setState({
            currentCriteriaType: condition,
            currentCriteriaValue: new CriteriaValue(condition.convertValue(this.state.currentCriteriaValue.value))
        });
    }

    private fieldChanged = (event) => {
        this.setState({
            currentField: event.target.value
        })
    }

    private criteriaValueChanged = (event) => {
        this.setState({
            currentCriteriaValue: new CriteriaValue(event.target.value)
        })
    }
}