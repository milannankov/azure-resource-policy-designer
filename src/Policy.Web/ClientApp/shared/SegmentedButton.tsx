import * as React from 'react';
import './SegmentedButton.css';

export interface Props {
    options: Array<SegmentedButtonOption>;
    selectedValue: string;
    onOptionSelected: (selected: SegmentedButtonOption) => void;
}

export interface SegmentedButtonOption {
    caption: string;
    value: string;
}

export class SegmentedButton extends React.PureComponent<Props, any> {
    render() {

        const options = this.props.options || [];

        return (
            <div className="segmentedButton">
                {options.map(o =>
                    <button
                        onClick={this.onOptionSelected}
                        key={o.value}
                        className={o.value === this.props.selectedValue ? "segmentedButtonOption selected" : "segmentedButtonOption"} 
                        value={o.value}>{o.caption}</button>
                )}
            </div>
        );
    }

    private onOptionSelected = (event) => {
        event.preventDefault();
        var selected = this.props.options.find(o => o.value == event.target.value);
        this.props.onOptionSelected(selected);
    }
}
