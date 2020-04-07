import React from "react";
import {Form, Input, Modal} from "antd";

class EnterpriseModal extends React.Component{

    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { handleOk } = this.props;
                handleOk(values);
            }
        })
    };

    render() {
        const { title, edit, handleCancel, confirmLoading } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        const name = edit ? this.props.name : '';
        return (
            <Modal
                title={title}
                visible={true}
                onOk={this.handleOk}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
            >
                <Form {...formItemLayout}>
                    {edit ? (
                        <Form.Item label={'企业代号'}>
                            <Input value={this.props.enterpriseId} disabled />
                        </Form.Item>
                    ) : null}
                    <Form.Item label="企业名称">
                        {getFieldDecorator('name', {
                            initialValue: name,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入企业名称!',
                                },
                            ],
                        })(<Input />)}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(EnterpriseModal);
