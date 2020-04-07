import React from "react";
import {Button, Card, Form, Icon, InputNumber, message} from "antd";
import '../../home/index.less'
import {withRouter} from "react-router";
import RawInput from "./rawInput";
import {checkTokenExpiration, get, post} from "../../../request";
import {backend_url} from "../../../config/httpRequest1";

const baseUrl = backend_url + 'batch/';
const productionLineUrl = backend_url + 'production_line/';

let id = 0;

class LaunchProduction extends React.Component{

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

    checkProductionLineId = (rule, value, callback) => {
        if ( value.length === 0 ) {
            return callback('请输入生产线Id');
        }
        if (!/^\d+$/.test(value)) {
            return callback('请输入正确的生产线Id');
        }
        /*axios({
            method: 'get',
            url: productionLineUrl + 'get_production_line/' + value
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
        });*/
        get(productionLineUrl + 'get_production_line/' + value).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
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
    };

    checkRaw = (rule, value, callback) => {
        const { casId, store, product, num, maxNum } = value;
        console.log(value);
        if (casId === 0 || casId === undefined) {
            return callback('请输入原料名称');
        }
        if (store === 0) {
            return callback('请选择仓库');
        }
        if (product === 0) {
            return callback('请选择批次');
        }
        if (isNaN(num)) {
            return callback('请正确输入原料数量');
        }
        if (num <= 0) {
            return callback('原料数量应大于0');
        }
        if (num > maxNum) {
            return callback('原料数量不应超过' + maxNum);
        }
        callback();
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { productionLineId, keys, raw } = values;
                console.log('Received values of form: ', values);
                if (keys.length === 0) {
                    message.error('请添加原料!');
                    return;
                }
                const data = {
                    type: 0,
                    productionLineId,
                    raws: keys.map(key => {
                        const { store, product, num } = raw[key];
                        return { productId: product, storeId: store, number: num };
                    })
                };
                console.log(data);
                /*axios({
                    method: 'post',
                    url: baseUrl + 'create_batch',
                    data
                }).then(function (res) {
                    const batchVO = res.data;
                    if (batchVO.code === 0) {
                        console.log('create batch failed')
                    } else if (batchVO.code === 1) {
                        message.success('本次生产发起成功，请尽快完成原料出库')
                        // todo: 清空页面
                    }
                }).catch(function (err) {
                    console.log(err)
                });*/
                post(baseUrl + 'create_batch', data).then(function (res) {
                    if (checkTokenExpiration(res, this.props.history))
                        return;
                    const batchVO = res.data;
                    if (batchVO.code === 0) {
                        console.log('create batch failed')
                    } else if (batchVO.code === 1) {
                        message.success('本次生产发起成功，请尽快完成原料出库')
                        // todo: 清空页面
                    }
                }.bind(this)).catch(function (err) {
                    console.log(err)
                });
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldValue  } = this.props.form;

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
                label={index === 0 ? '原料' : ''}
                required={false}
                key={k}
            >
                {getFieldDecorator(`raw[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    initialValue: { casId: undefined, store: 0, product: 0, num: 0, maxNum: 0 },
                    rules: [{ validator: this.checkRaw }]
                })(<RawInput enterpriseId={enterpriseId} getHistory={() => this.props.history} />)}
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
            <Card title={'发起生产'}>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label={'生产线Id'}>
                        {getFieldDecorator(`productionLineId`, {
                            rules: [{ validator: this.checkProductionLineId }]
                        })(<InputNumber min={0} placeholder="生产线Id" />)}
                    </Form.Item>

                    {formItems}
                    <Form.Item {...formItemLayoutWithOutLabel}>
                        <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                            <Icon type="plus" /> 添加原料
                        </Button>
                    </Form.Item>

                    <Form.Item {...formItemLayoutWithOutLabel}>
                        <Button type="primary" htmlType="submit">
                            发起生产
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

        )
    }
}


export default withRouter(Form.create()(LaunchProduction));
