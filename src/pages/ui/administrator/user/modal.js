import React from "react";
import {Form, Input, Modal, Select} from "antd";

const { Option } = Select;

const userTypeList = [
    { type: 1, name: '操作员' },
    { type: 2, name: '管理员' },
    { type: 3, name: '监控员' }
];

class UserModal extends React.Component{

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
        const password = edit ? this.props.password : '';
        const type = edit ? this.props.type : 1;
        const userTypeOptions = userTypeList.map(ut => (
            <Option value={ut['type']} key={ut['type']}>{ut['name']}</Option>
        ));
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
                        <Form.Item label={'用户编号'}>
                            <Input value={this.props.userId} disabled />
                        </Form.Item>
                    ) : null}
                    <Form.Item label="用户名">
                        {getFieldDecorator('name', {
                            initialValue: name,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="密码">
                        {getFieldDecorator('password', {
                            initialValue: password,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入密码!',
                                },
                            ],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="用户类型">
                        {getFieldDecorator('type', {
                            initialValue: type
                        })(<Select style={{ width: 150 }}>
                            {userTypeOptions}
                        </Select>)}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(UserModal);
