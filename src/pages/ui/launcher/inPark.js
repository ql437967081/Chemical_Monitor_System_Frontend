import React from "react";
import {Button, Card, Form, Icon, InputNumber, message} from "antd";
import '../../home/index.less'
import {withRouter} from "react-router";
import ProductInput from "../launcher/productInput";
import {checkTokenExpiration, get, post} from "../../../request";
import {backend_url} from "../../../config/httpRequest1";

const productionLineUrl = backend_url + 'production_line/';
const batchUrl = backend_url + 'batch/';

let id = 0;
let productionLineId = 0;

class InPark extends React.Component{

    remove = k => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    };

    checkEnterpriseId = (rule, value, callback) => {
        if ( value.length === 0 ) {
            return callback('请输入企业代号');
        }
        if (!/^\d+$/.test(value)) {
            return callback('请输入正确的企业代号');
        }
        /*
        axios({
            method: 'get',
            url: productionLineUrl + 'get_in_park_by_eid/' + value
        }).then(function (res) {
            const productionLineVO = res.data;
            if (productionLineVO.code === 0) {
                productionLineId = 0;
                callback('不存在该企业或该企业不能进行产品入园');
            } else if (productionLineVO.code === 1) {
                productionLineId = productionLineVO.productionLineId;
                callback();
            }
        }).catch(function (err) {
            console.log(err);
            productionLineId = 0;
            callback('未查询到该企业');
        });

         */
        get(productionLineUrl + 'get_in_park_by_eid/' + value).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            const productionLineVO = res.data;
            if (productionLineVO.code === 0) {
                productionLineId = 0;
                callback('不存在该企业或该企业不能进行产品入园');
            } else if (productionLineVO.code === 1) {
                productionLineId = productionLineVO.productionLineId;
                callback();
            }
        }.bind(this)).catch(function (err) {
            console.log(err);
            productionLineId = 0;
            callback('未查询到该企业');
        });
    };

    checkProduct = (rule, value, callback) => {
        console.log(value);
        const { store, casId, num } = value;
        if (casId === 0 || casId === undefined) {
            return callback('请输入产品名称')
        }
        if (store === 0) {
            return callback('请选择仓库');
        }
        if (isNaN(num)) {
            return callback('请正确输入产品数量');
        }
        if (num <= 0) {
            return callback('产品数量应大于0');
        }
        callback();
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { enterpriseId, keys, product } = values;
                console.log('Received values of form: ', values);
                console.log('enterpriseId: ', enterpriseId);
                if (keys.length === 0) {
                    message.error('请添加入园产品!');
                    return;
                }
                console.log('Merged values:', keys.map(key => product[key]));
                const createBatchRequest = {
                    type: 1,
                    productionLineId,
                    raws: []
                };
                console.log(createBatchRequest);
                /*
                axios({
                    method: 'post',
                    url: batchUrl + 'create_batch',
                    data: createBatchRequest
                }).then(function (res) {
                    const batchVO = res.data;
                    if (batchVO.code === 0) {
                        console.log('create batch failed')
                    } else if (batchVO.code === 1) {
                        const { batchId } = batchVO;
                        const batchOutRequest = {
                            batchId,
                            products: keys.map(key => {
                                const { casId, store, num } = product[key];
                                return { casId, storeId: store, number: num };
                            })
                        };
                        axios({
                            method: 'post',
                            url: batchUrl + 'batch_out',
                            data: batchOutRequest
                        }).then(function (res) {
                            const batchVO = res.data;
                            if (batchVO.code === 0) {
                                console.log('batch out failed')
                            } else if (batchVO.code === 1) {
                                message.success('产品入园成功，请尽快完成产品入库')
                                // todo: 清空页面
                            }
                        }).catch(function (err) {
                            console.log(err)
                        });
                    }
                }).catch(function (err) {
                    console.log(err)
                });

                 */

                post(batchUrl + 'create_batch', createBatchRequest).then(function (res) {
                    if (checkTokenExpiration(res, this.props.history))
                        return;
                    const batchVO = res.data;
                    if (batchVO.code === 0) {
                        console.log('create batch failed')
                    } else if (batchVO.code === 1) {
                        const { batchId } = batchVO;
                        const batchOutRequest = {
                            batchId,
                            products: keys.map(key => {
                                const { casId, store, num } = product[key];
                                return { casId, storeId: store, number: num };
                            })
                        };
                        post(batchUrl + 'batch_out', batchOutRequest).then(function (res) {
                            const batchVO = res.data;
                            if (batchVO.code === 0) {
                                console.log('batch out failed')
                            } else if (batchVO.code === 1) {
                                message.success('产品入园成功，请尽快完成产品入库')
                                // todo: 清空页面
                            }
                        }).catch(function (err) {
                            console.log(err)
                        });
                    }
                }.bind(this)).catch(function (err) {
                    console.log(err)
                });
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: { span: 18, offset: 6 }
        };

        const x = getFieldValue('enterpriseId');
        const enterpriseId = x ? x : 0;

        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? '产品' : ''}
                required={false}
                key={k}
            >
                {getFieldDecorator(`product[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    initialValue: { store: 0, num: 0, casId: undefined },
                    rules: [{ validator: this.checkProduct }]
                })(<ProductInput enterpriseId={enterpriseId} getHistory={() => this.props.history} />)}
                {keys.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                ) : null}
            </Form.Item>
        ));

        return(
            <Card title={'产品入园'}>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label={'企业代号'}>
                        {getFieldDecorator(`enterpriseId`, {
                            rules: [{ validator: this.checkEnterpriseId }]
                        })(<InputNumber min={0} placeholder="企业代号" />)}
                    </Form.Item>
                    {formItems}
                    <Form.Item {...formItemLayoutWithOutLabel}>
                        <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                            <Icon type="plus" /> 添加产品
                        </Button>
                    </Form.Item>
                    <Form.Item {...formItemLayoutWithOutLabel}>
                        <Button type="primary" htmlType="submit">
                            入园
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

        )
    }
}


export default withRouter(Form.create()(InPark));
