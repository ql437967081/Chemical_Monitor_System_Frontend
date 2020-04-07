import React from "react";
import {Button, Card, Form, message} from "antd";
import OutParkInput from "./outParkInput";
import {withRouter} from "react-router";
import {checkTokenExpiration, get, post} from "../../../request";
import {backend_url} from "../../../config/httpRequest1";

const baseUrl = backend_url + 'batch/';
const productionLineUrl = backend_url + 'production_line/';

class LaunchDestroy extends React.Component{

    check = (rule, value, callback) => {
        console.log(value);
        if (value.store === 0) {
            return callback('请选择仓库');
        }
        if (value.product === 0) {
            return callback('请选择产品');
        }
        const num = value.num;
        if (isNaN(num)) {
            return callback('请正确输入产品数量');
        }
        if (num <= 0) {
            return callback('产品数量应大于0');
        }
        if (num > value.maxNum) {
            return callback('产品数量不应超过' + value.maxNum);
        }
        callback();
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                const { store, product, num, enterpriseId } = values['destroyProduct'];
                /*axios({
                    method: 'get',
                    url: productionLineUrl + 'get_destroy_by_eid/' + enterpriseId
                }).then(function (res) {
                    const productionLineVO = res.data;
                    if (productionLineVO.code === 0) {
                        message.error('禁止销毁该仓库产品');
                    } else if (productionLineVO.code === 1) {
                        const productionLineId = productionLineVO.productionLineId;
                        const data = {
                            type: 3,
                            productionLineId,
                            raws: [{ productId: product, storeId: store, number: num }]
                        };
                        axios({
                            method: 'post',
                            url: baseUrl + 'create_batch',
                            data
                        }).then(function (res) {
                            const batchVO = res.data;
                            if (batchVO.code === 0) {
                                console.log('create batch failed')
                            } else if (batchVO.code === 1) {
                                message.success('本次销毁发起成功，请尽快完成销毁操作')
                                // todo: 清空页面
                            }
                        }).catch(function (err) {
                            console.log(err)
                        });
                    }
                }).catch(function (err) {
                    console.log(err);
                    message.error('未查询到该仓库');
                });*/
                get(productionLineUrl + 'get_destroy_by_eid/' + enterpriseId).then(function (res) {
                    if (checkTokenExpiration(res, this.props.history))
                        return;
                    const productionLineVO = res.data;
                    if (productionLineVO.code === 0) {
                        message.error('禁止销毁该仓库产品');
                    } else if (productionLineVO.code === 1) {
                        const productionLineId = productionLineVO.productionLineId;
                        const data = {
                            type: 3,
                            productionLineId,
                            raws: [{ productId: product, storeId: store, number: num }]
                        };
                        post(baseUrl + 'create_batch', data).then(function (res) {
                            const batchVO = res.data;
                            if (batchVO.code === 0) {
                                console.log('create batch failed')
                            } else if (batchVO.code === 1) {
                                message.success('本次销毁发起成功，请尽快完成销毁操作')
                                // todo: 清空页面
                            }
                        }).catch(function (err) {
                            console.log(err)
                        });
                    }
                }.bind(this)).catch(function (err) {
                    console.log(err);
                    message.error('未查询到该仓库');
                });
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: { span: 18, offset: 6 }
        };

        return (
            <Card title={'发起销毁'}>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label={'销毁产品'}>
                        {getFieldDecorator(`destroyProduct`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            initialValue: { store: 0, product: 0, num: 0 },
                            rules: [{ validator: this.check }]
                        })(<OutParkInput getHistory={() => this.props.history} />)}
                    </Form.Item>
                    <Form.Item {...formItemLayoutWithOutLabel}>
                        <Button type="primary" htmlType="submit">
                            发起销毁
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        );
    }
}

export default withRouter(Form.create()(LaunchDestroy));
