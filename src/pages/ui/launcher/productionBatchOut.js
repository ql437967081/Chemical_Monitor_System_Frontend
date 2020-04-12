import React from "react";
import {Button, Card, Form, Icon, InputNumber, message} from "antd";
import '../../home/index.less'
import {withRouter} from "react-router";
import ProductInput from "../launcher/productInput";
import {checkTokenExpiration, get, post} from "../../../request";
import {backend_url} from "../../../config/httpRequest1";

const batchUrl = backend_url + 'batch/';
const productionLineUrl = backend_url + 'production_line/';

let id = 0;

class ProductionBatchOut extends React.Component{

    state = {
        enterpriseId: 0
    };

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

    checkBatchId = (rule, value, callback) => {
        if ( value.length === 0 ) {
            return callback('请输入生产批次');
        }
        if (!/^\d+$/.test(value)) {
            return callback('请输入正确的生产批次');
        }
        /*
        axios({
            method: 'get',
            url: batchUrl + 'get_batch/' + value
        }).then(function (res) {
            const batchVO = res.data;
            const { code, type, productionLineId }= batchVO;
            if (code === 0 || type !== 0) {
                return callback('不存在该生产批次');
            } else if (code === 1) {
                axios({
                    method: 'get',
                    url: productionLineUrl + 'get_production_line/' + productionLineId
                }).then(function (res) {
                    const productionLineVO = res.data;
                    if (productionLineVO.code === 0) {
                        callback('不存在该生产线');
                    } else if (productionLineVO.code === 1) {
                        this.setState({ enterpriseId: productionLineVO.enterpriseId });
                        callback();
                    }
                }.bind(this)).catch(function (err) {
                    console.log(err);
                    callback('未查询到该生产线');
                });
            }
        }.bind(this)).catch(function (err) {
            console.log(err);
            callback('未查询到该批次');
        });
        */
        get(batchUrl + 'get_batch/' + value).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            const batchVO = res.data;
            const { code, type, productionLineId }= batchVO;
            if (code === 0 || type !== 0) {
                return callback('不存在该生产批次');
            } else if (code === 1) {
                get(productionLineUrl + 'get_production_line/' + productionLineId).then(function (res) {
                    const productionLineVO = res.data;
                    if (productionLineVO.code === 0) {
                        callback('不存在该生产线');
                    } else if (productionLineVO.code === 1) {
                        this.setState({ enterpriseId: productionLineVO.enterpriseId });
                        callback();
                    }
                }.bind(this)).catch(function (err) {
                    console.log(err);
                    callback('未查询到该生产线');
                });
            }
        }.bind(this)).catch(function (err) {
            console.log(err);
            callback('未查询到该批次');
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
                const { batchId, keys, product } = values;
                console.log('Received values of form: ', values);
                console.log('batchId: ', batchId);
                if (keys.length === 0) {
                    message.error('请添加该批次生产的产品!');
                    return;
                }
                console.log('Merged values:', keys.map(key => product[key]));
                const batchOutRequest = {
                    batchId,
                    products: keys.map(key => {
                        const { casId, store, num } = product[key];
                        return { casId, storeId: store, number: num };
                    })
                };
                /*
                axios({
                    method: 'post',
                    url: batchUrl + 'batch_out',
                    data: batchOutRequest
                }).then(function (res) {
                    const batchVO = res.data;
                    if (batchVO.code === 0) {
                        console.log('batch out failed')
                    } else if (batchVO.code === 1) {
                        message.success('本次生产的产品已成功记录，请尽快完成产品入库')
                        // todo: 清空页面
                    }
                }).catch(function (err) {
                    console.log(err)
                });
                */
                post(batchUrl + 'batch_out', batchOutRequest).then(function (res) {
                    if (checkTokenExpiration(res, this.props.history))
                        return;
                    const batchVO = res.data;
                    if (batchVO.code === 0) {
                        console.log('batch out failed')
                    } else if (batchVO.code === 1) {
                        message.success('本次生产的产品已成功记录，请尽快完成产品入库')
                        // todo: 清空页面
                    }
                }.bind(this)).catch(function (err) {
                    console.log(err)
                });
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;

        const { enterpriseId } = this.state;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: { span: 18, offset: 6 }
        };

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
            <Card title={'生产完成-产品录入'}>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label={'生产批次'}>
                        {getFieldDecorator(`batchId`, {
                            rules: [{ validator: this.checkBatchId }]
                        })(<InputNumber min={0} placeholder="生产批次" />)}
                    </Form.Item>
                    {formItems}
                    <Form.Item {...formItemLayoutWithOutLabel}>
                        <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                            <Icon type="plus" /> 添加产品
                        </Button>
                    </Form.Item>
                    <Form.Item {...formItemLayoutWithOutLabel}>
                        <Button type="primary" htmlType="submit">
                            产品录入
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

        )
    }
}


export default withRouter(Form.create()(ProductionBatchOut));
