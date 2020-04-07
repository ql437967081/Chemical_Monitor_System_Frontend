import React from "react";
import {InputNumber} from "antd";

export default class ProductInInput extends React.Component {

    handleProductIdChange = productId => {
        this.triggerChange({ productId });
    };

    handleNumChange = num => {
        this.triggerChange({ num });
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
        const { value, size } = this.props;
        return (
            <span>
                <InputNumber
                    min={0}
                    value={value.productId}
                    placeholder='产品编号'
                    size={size}
                    style={{ marginRight: 8 }}
                    onChange={this.handleProductIdChange}
                />
                <InputNumber
                    min={0}
                    value={value.num}
                    placeholder='数量'
                    size={size}
                    style={{ marginRight: 8 }}
                    onChange={this.handleNumChange}
                />
            </span>
        );
    }
}
