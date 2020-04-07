import React from "react";
import {Form, InputNumber} from "antd";

class ExpressNumInputForm extends React.Component {

    check = (rule, value, callback) => {
        const { leftNum, onCheck } = this.props;
        //console.log(value);
        if (isNaN(value)) {
            return callback('请正确输入产品数量');
        }
        if (value <= 0) {
            return callback('产品数量应大于0');
        }
        if (value > leftNum) {
            return callback('产品数量不应超过' + leftNum);
        }
        callback();
        onCheck(value);
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { initialValue, leftNum } = this.props;
        return (
            <Form>
                <Form.Item>
                    {getFieldDecorator(`expressNum`, {
                        validateTrigger: ['onChange'],
                        initialValue,
                        rules: [{ validator: this.check }]
                    })(<InputNumber min={0} max={leftNum} />)}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(ExpressNumInputForm)
