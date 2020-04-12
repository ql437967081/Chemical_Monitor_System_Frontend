import React from "react";
import {withRouter} from "react-router";
import {Alert, Button, Card, Form, InputNumber, message, Table} from "antd";

import {checkTokenExpiration, get, post} from "../../../request";
import {backend_url} from "../../../config/httpRequest1";

const batchUrl = backend_url + 'batch/';
const inoutUrl = backend_url + 'inout/';

const columns = [
    {
        title: '产品名称',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '产品批次',
        dataIndex: 'batch',
        key: 'batch'
    },
    {
        title: '本次销毁数量',
        dataIndex: 'thisNum',
        key: 'thisNum'
    },
    {
        title: '已销毁数量',
        dataIndex: 'finishedNum',
        key: 'finishedNum'
    },
    {
        title: '应销毁数量',
        dataIndex: 'num',
        key: 'num'
    }
];

class Destroy extends React.Component {

    state = {
        batchId: 0,
        scanLoading: false,
        allCompleted: false,
        scannedProducts: []
    };

    checkBatch = (rule, value, callback) => {
        if ( value.length === 0 ) {
            return callback('请输入销毁批次');
        }
        if (!/^\d+$/.test(value)) {
            return callback('请输入正确的销毁批次');
        }
        callback();
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const { batchId } = values;
                /*axios({
                    method: 'get',
                    url: batchUrl + 'get_batch/' + batchId
                }).then(function (res) {
                    const batchVO = res.data;
                    const { code, type }= batchVO;
                    if (code === 1 && type === 3) {
                        this.setState({ batchId });
                    } else {
                        message.error('请输入正确的销毁批次');
                    }
                }.bind(this)).catch(function (err) {
                    console.log(err);
                });*/
                get(batchUrl + 'get_batch/' + batchId).then(function (res) {
                    if (checkTokenExpiration(res, this.props.history))
                        return;
                    const batchVO = res.data;
                    const { code, type }= batchVO;
                    if (code === 1 && type === 3) {
                        this.setState({ batchId });
                    } else {
                        message.error('请输入正确的销毁批次');
                    }
                }.bind(this)).catch(function (err) {
                    console.log(err);
                });
            }
        });
    };

    scanProduct = () => {
        this.setState({
            scanLoading: true
        });
        const { batchId, scannedProducts } = this.state;
        /*axios({
            method: 'get',
            url: batchUrl + 'get_batch_in_stores/' + batchId
        }).then(function (res) {
            const stores = res.data;
            if (stores.length === 0) {
                message.error('该销毁批次需要销毁的产品已全部销毁！');
                return;
            }
            const {storeId} = stores[0];
            axios({
                method: 'post',
                url: inoutUrl + 'input_batch/' + batchId + '/' + storeId,
            }).then(function (res) {
                const resp = res.data;
                const changedState = {};
                if (resp.code === 0) {
                    message.error(resp.message)
                } else {
                    const len = scannedProducts.length;
                    const { productVO, number, thisNumber, finishedNumber } = resp;
                    changedState['scannedProducts'] = scannedProducts.concat({
                        key: (len + 1), name: productVO.cas.name, batch: productVO.batchId,
                        num: number, thisNum: thisNumber, finishedNum: finishedNumber
                    });
                    message.success('扫描成功');
                    if (resp.code === 2) {
                        changedState['allCompleted'] = true;
                    }
                }
                changedState['scanLoading'] = false;
                this.setState(changedState);
            }.bind(this)).catch(function (err) {
                console.log(err);
            });
        }.bind(this)).catch(function (err) {
            console.log(err)
        });*/
        get(batchUrl + 'get_batch_in_stores/' + batchId).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            const stores = res.data;
            if (stores.length === 0) {
                message.error('该销毁批次需要销毁的产品已全部销毁！');
                return;
            }
            const {storeId} = stores[0];
            post(inoutUrl + 'input_batch/' + batchId + '/' + storeId, undefined).then(function (res) {
                const resp = res.data;
                const changedState = {};
                if (resp.code === 0) {
                    message.error(resp.message)
                } else {
                    const len = scannedProducts.length;
                    const { productVO, number, thisNumber, finishedNumber } = resp;
                    changedState['scannedProducts'] = scannedProducts.concat({
                        key: (len + 1), name: productVO.cas.name, batch: productVO.batchId,
                        num: number, thisNum: thisNumber, finishedNum: finishedNumber
                    });
                    message.success('扫描成功');
                    if (resp.code === 2) {
                        changedState['allCompleted'] = true;
                    }
                }
                changedState['scanLoading'] = false;
                this.setState(changedState);
            }.bind(this)).catch(function (err) {
                console.log(err);
            });
        }.bind(this)).catch(function (err) {
            console.log(err)
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { batchId, scanLoading, scannedProducts, allCompleted } = this.state;
        const begin = batchId !== 0;
        return (
            <Card title={'销毁'}>
                { !begin ? (
                    <Form layout={"inline"} onSubmit={this.handleSubmit}>
                        <Form.Item label={'销毁批次'}>
                            {getFieldDecorator(`batchId`, {
                                rules: [
                                    { validator: this.checkBatch }
                                ],
                            })(<InputNumber min={0} />)}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                开始销毁
                            </Button>
                        </Form.Item>
                    </Form>
                ) : (
                    <Form layout={"inline"}>
                        <Form.Item label={'销毁批次'}>
                            <Alert message={batchId} />
                        </Form.Item>
                        <Form.Item>
                            { allCompleted ? (
                                <Alert message="本次销毁已完成" type="success" />
                            ) : (
                                <Button type="primary" loading={scanLoading} onClick={this.scanProduct}>
                                    扫描产品
                                </Button>
                            )}
                        </Form.Item>
                    </Form>
                )}
                { begin ? (
                    <Table columns={columns} dataSource={scannedProducts} />
                ) : null}
            </Card>
        );
    }
}

export default withRouter(Form.create()(Destroy));
