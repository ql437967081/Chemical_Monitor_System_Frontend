import React from "react";
import {Select} from "antd";

const { Option } = Select;

const QUARTER_TYPES = [ null, '第一季度', '第二季度', '第三季度', '第四季度' ];

export default class QuarterSelector extends React.Component {

    handleYearChange = year => {
        this.triggerChange({ year });
    };

    handleQuarterChange = quarter => {
        this.triggerChange({ quarter });
    };

    triggerChange = changedValue => {
        const { onChange, value } = this.props;
        if (onChange) {
            onChange({
                ...value,
                ...changedValue,
            });
        }
    };

    render() {
        const { size, value, minYear, maxYear, minQuarter, maxQuarter } = this.props;

        const { year, quarter } = value;

        const yearOptions = [];
        const minY = quarter && quarter < minQuarter ? minYear + 1 : minYear;
        const maxY = quarter > maxQuarter ? maxYear - 1 : maxYear;
        for (let y = minY; y <= maxY; y++) {
            yearOptions.push(<Option value={y} key={y}>{y}</Option>)
        }

        const quarterOptions = [];
        const minQ = year === minYear ? minQuarter : 1;
        const maxQ = year === maxYear ? maxQuarter : 4;
        for (let q = minQ; q <= maxQ; q++) {
            quarterOptions.push(<Option value={q} key={q}>{QUARTER_TYPES[q]}</Option>)
        }

        return (
            <span>
                <Select
                    value={year}
                    size={size}
                    style={{width: 80}}
                    onChange={this.handleYearChange}
                    placeholder={'年份'}
                    firstActiveValue={'' + maxY}
                >
                    {yearOptions}
                </Select>
                <Select
                    value={quarter}
                    size={size}
                    style={{width: 95}}
                    onChange={this.handleQuarterChange}
                    placeholder={'季度'}
                >
                    {quarterOptions}
                </Select>
            </span>
        );
    }
}
