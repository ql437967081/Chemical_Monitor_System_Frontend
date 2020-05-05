import React from "react";
import {Alert, Button, Form, message} from "antd";
import ProductInInput from "./productInInput";
import {checkTokenExpiration, post} from "../../../request";
import {backend_url} from "../../../config/httpRequest1";

const inoutUrl = backend_url + 'inout/';

const BATCH_TYPE = ['生产', '入园', '出园', '销毁'];

class ProductInForm extends React.Component {

    state = {
        scanLoading: false
    };

    checkProduct = (rule, value, callback) => {
        const { productId, num } = value;
        if ( productId.length === 0 ) {
            return callback('请输入产品编号');
        }
        if (!/^\d+$/.test(productId)) {
            return callback('请输入正确的产品编号');
        }
        if (isNaN(num)) {
            return callback('请正确输入原料数量');
        }
        if (num <= 0) {
            return callback('原料数量应大于0');
        }
        callback();
    };

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { batchId, storeId, onSuccess, getHistory } = this.props;
                const { productId, num } = values.product;
                console.log('Received values of form: ', values);
                this.setState({ scanLoading: true });
                /*axios({
                    method: 'post',
                    url: inoutUrl + 'output_batch/' + batchId + '/' + storeId + '/' + productId + '/' + num
                }).then(function (res) {
                    const resp = res.data;
                    if (resp.code === 0) {
                        message.error(resp.message);
                    } else {
                        onSuccess(resp);
                        this.props.form.setFieldsValue({product: { productId: undefined, num: undefined }});
                    }
                    this.setState({ scanLoading: false });
                }.bind(this)).catch(function (err) {
                    console.log(err)
                });*/
                post(inoutUrl + 'output_batch/' + batchId + '/' + storeId + '/' + productId + '/' + num, undefined).then(function (res) {
                    if (checkTokenExpiration(res, getHistory()))
                        return;
                    const resp = res.data;
                    if (resp.code === 0) {
                        message.error(resp.message);
                    } else {
                        onSuccess(resp);
                        this.props.form.setFieldsValue({product: { productId: undefined, num: undefined }});
                    }
                    this.setState({ scanLoading: false });
                }.bind(this)).catch(function (err) {
                    console.log(err)
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { batchId, selectedStore, allCompleted, batchType } = this.props;
        const { scanLoading } = this.state;

        return (
            <Form layout={"inline"} onSubmit={this.handleSubmit}>
                <Form.Item label={`${BATCH_TYPE[batchType]}批次`}>
                    <Alert message={batchId} />
                </Form.Item>
                <Form.Item label={'仓库'}>
                    <Alert message={selectedStore} />
                </Form.Item>
                {allCompleted ? (
                    <Form.Item>
                        <Alert message={`批次${batchId}需要入库${selectedStore}的产品已全部入库`} type={"success"} />
                    </Form.Item>
                ) : [
                    (
                        <Form.Item label={'请填写入库产品的编号和数量后贴标签并扫描'} key={0}>
                            {getFieldDecorator('product', {
                                validateTrigger: ['onChange', 'onBlur'],
                                initialValue: { productId: undefined, num: undefined },
                                rules: [{ validator: this.checkProduct }]
                            })(<ProductInInput />)}
                        </Form.Item>
                    ),
                    (
                        <Form.Item key={1}>
                            <Button type="primary" htmlType="submit" loading={scanLoading}>
                                扫描产品
                            </Button>
                        </Form.Item>
                    )
                ]}
            </Form>
        )
    }
}

export default Form.create()(ProductInForm)
