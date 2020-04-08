import React from "react";
import {withRouter} from "react-router";
import {Alert, Button, Card, Form, InputNumber, message, Table} from "antd";
import {checkTokenExpiration, get, post} from "../../../request";
import {backend_url} from "../../../config/httpRequest1";

const baseUrl = backend_url + 'express/';

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
        title: '本次出库数量',
        dataIndex: 'thisNum',
        key: 'thisNum'
    },
    {
        title: '已出库数量',
        dataIndex: 'finishedNum',
        key: 'finishedNum'
    },
    {
        title: '应出库数量',
        dataIndex: 'num',
        key: 'num'
    }
];

class ExpressOut extends React.Component {

    state = {
        expressId: 0,
        scanLoading: false,
        allCompleted: false,
        scannedProducts: []
    };

    checkExpress = (rule, value, callback) => {
        if ( value.length === 0 ) {
            return callback('请输入物流单号');
        }
        if (!/^\d+$/.test(value)) {
            return callback('请输入正确的物流单号');
        }
        callback();
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const { expressId } = values;
                /*axios({
                    method: 'get',
                    url: baseUrl + 'get_express/' + expressId
                }).then(function (res) {
                    const expressVO = res.data.data;
                    const { code, status } = expressVO;
                    if (code === 1 && status % 4 === 0) {
                        this.setState({ expressId });
                    } else {
                        message.error('请输入正确的物流单号');
                    }
                }.bind(this)).catch(function (err) {
                    console.log(err);
                });*/
                get(baseUrl + 'get_express/' + expressId).then(function (res) {
                    if (checkTokenExpiration(res, this.props.history))
                        return;
                    const expressVO = res.data;
                    const { code, status } = expressVO;
                    if (code === 1 && status % 4 === 0) {
                        this.setState({ expressId });
                    } else {
                        message.error('请输入正确的物流单号');
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
        const { expressId, scannedProducts } = this.state;
        /*axios({
            method: 'post',
            url: baseUrl + 'output_product/' + expressId
        }).then(function (res) {
            const resp = res.data.data;
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
        });*/
        post(baseUrl + 'output_product/' + expressId, undefined).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            const resp = res.data;
            const changedState = {};
            if (res.code !== 200) {
                message.error(res.msg)
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
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { expressId, scanLoading, scannedProducts, allCompleted } = this.state;
        const begin = expressId !== 0;
        return (
            <Card title={'物流出库'}>
                { !begin ? (
                    <Form layout={"inline"} onSubmit={this.handleSubmit}>
                        <Form.Item label={'物流单号'}>
                            {getFieldDecorator(`expressId`, {
                                rules: [
                                    { validator: this.checkExpress }
                                ],
                            })(<InputNumber min={0} />)}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                开始出库
                            </Button>
                        </Form.Item>
                    </Form>
                ) : (
                    <Form layout={"inline"}>
                        <Form.Item label={'物流单号'}>
                            <Alert message={expressId} />
                        </Form.Item>
                        <Form.Item>
                            { allCompleted ? (
                                <Alert message="本次物流出库完成" type="success" />
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

export default withRouter(Form.create()(ExpressOut));
