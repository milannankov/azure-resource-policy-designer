import * as React from 'react';
import * as fields from '../fields';
import { ComboBox } from '@progress/kendo-dropdowns-react-wrapper';
import * as classnames from 'classnames';

export interface Props {
    fieldValue: fields.FieldValue;
    knownFields: ReadonlyArray<fields.IKnownPolicyField>;
    onFieldChanged(value: string)
}

export interface State {
    expressionEditor: boolean;
}

export class PolicyFieldEditor extends React.Component<Props, State> {

    private comboRef: ComboBox;

    constructor(props: Props) {
        super(props);

        this.state = {
            expressionEditor: props.fieldValue.isExpression
        }
    }

    render() {

        const options = {
            filter: "contains",
            dataTextField: "value",
            dataValueField: "value",
            height: 600,
            dataSource: {
                data: this.props.knownFields,
                group: { field: "group" }
            },
            value: this.props.fieldValue.value
        }

        let toggleClassNames = classnames({
            'formEditorToggle': true,
            'active': this.state.expressionEditor
        });

        let comboBoxContainerClasses = classnames({
            'inputLine': true,
            'formEditorMainContainer': true,
            'hidden': this.state.expressionEditor
        });

        let expressionContainerClasses = classnames({
            'inputLine': true,
            'formEditorMainContainer': true,
            'hidden': !this.state.expressionEditor
        });

        return (

            <div className="formEditorContent">
                <div className={comboBoxContainerClasses}>
                    <ComboBox {...options} ref={(r) => this.comboRef = r} />
                </div>
                <div className={expressionContainerClasses}>
                    <input className="wideInput simpleInputBox" value={this.props.fieldValue.value} onChange={this.onExpressionChanged}/>
                </div>
                <div className="formEditorToggleContainer">
                    <button className={toggleClassNames} onClick={this.onExpressionClicked}></button>
                </div>
            </div>
        );
    }

    private onExpressionChanged = (event) => {
        this.props.onFieldChanged(event.target.value.toString());
    }

    private onExpressionClicked = (e) => {

        this.setState({
            expressionEditor: !this.state.expressionEditor
        });
    }

    componentDidMount() {
        this.comboRef.widgetInstance.unbind("change", this.onFieldValueChanged);
        this.comboRef.widgetInstance.bind("change", this.onFieldValueChanged);
    }

    componentDidUpdate(prevProps, prevState) {
        this.comboRef.widgetInstance.unbind("change", this.onFieldValueChanged);
        this.comboRef.widgetInstance.bind("change", this.onFieldValueChanged);
    }

    private onFieldValueChanged = (e) => {
        var fieldValue = e.sender.value();

        if (fieldValue === this.props.fieldValue.value) {
            return;
        }

        this.props.onFieldChanged(fieldValue);
    }
}
