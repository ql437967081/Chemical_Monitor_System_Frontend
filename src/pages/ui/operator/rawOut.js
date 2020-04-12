import React from "react";
import {withRouter} from "react-router";
import {Alert, Button, Card, Form, InputNumber, message, Select, Table} from "antd";
import {checkTokenExpiration, get, post} from "../../../request";
import {backend_url} from "../../../config/httpRequest1";

const batchUrl = backend_url + 'batch/';
const inoutUrl = backend_url + 'inout/';

const { Option } = Select;

const columns = [
    {
        title: '原料名称',
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

class RawOut extends React.Component {

    state = {
        batchId: 0,
        storeId: 0,
        stores: [],
        scanLoading: false,
        allCompleted: false,
        scannedProducts: []
    };

    checkBatch = (rule, value, callback) => {
        if ( value.length === 0 ) {
            return callback('请输入生产批次');
        }
        if (!/^\d+$/.test(value)) {
            return callback('请输入正确的生产批次');
        }
        /*axios({
            method: 'get',
            url: batchUrl + 'get_batch/' + value
        }).then(function (res) {
            const batchVO = res.data;
            const { code, type }= batchVO;
            if (code === 0 || type !== 0) {
                return callback('不存在该生产批次');
            } else if (code === 1) {
                const { form } = this.props;
                if (form.getFieldValue('batchId') !== value)
                    form.setFieldsValue({ storeId: 0 });
                axios({
                    method: 'get',
                    url: batchUrl + 'get_batch_in_stores/' + value
                }).then(function (res) {
                    const stores = [];
                    for (let store of res.data) {
                        const { storeId, name } = store;
                        stores.push({ storeId, name })
                    }
                    if (stores.length === 0)
                        callback('该批次原料已经全部出库');
                    else {
                        if (stores.length === 1)
                            form.setFieldsValue({ storeId: 1 });
                        callback();
                    }
                    this.setState({ stores });
                }.bind(this)).catch(function (err) {
                    console.log(err);
                    callback('未查询到仓库');
                });
            }
        }.bind(this)).catch(function (err) {
            console.log(err);
            callback('未查询到该批次');
        });*/
        get(batchUrl + 'get_batch/' + value).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            const batchVO = res.data;
            const { code, type }= batchVO;
            const { form } = this.props;
            form.setFieldsValue({ storeId: 0 });
            if (code === 0 || type !== 0) {
                this.setState({ stores: [] });
                return callback('不存在该生产批次');
            } else if (code === 1) {
                get(batchUrl + 'get_batch_in_stores/' + value).then(function (res) {
                    const stores = [];
                    for (let store of res.data) {
                        const { storeId, name } = store;
                        stores.push({ storeId, name })
                    }
                    if (stores.length === 0)
                        callback('该批次原料已经全部出库');
                    else {
                        if (stores.length === 1)
                            form.setFieldsValue({ storeId: 1 });
                        callback();
                    }
                    this.setState({ stores });
                }.bind(this)).catch(function (err) {
                    console.log(err);
                    callback('未查询到仓库');
                });
            }
        }.bind(this)).catch(function (err) {
            console.log(err);
            callback('未查询到该批次');
        });
    };

    checkStore = (rule, value, callback) => {
        if (value === 0)
            callback('请选择仓库');
        else
            callback();
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { batchId, storeId } = values;
                console.log('Received values of form: ', values);
                if (storeId === 0) {
                    const { form } = this.props;
                    form.setFieldsValue({ storeId: 0 });
                    return;
                }
                this.setState({ batchId, storeId });
            }
        });
    };

    scanProduct = () => {
        this.setState({
            scanLoading: true
        });
        const { batchId, storeId, scannedProducts } = this.state;
        /*axios({
            method: 'post',
            url: inoutUrl + 'input_batch/' + batchId + '/' + storeId
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
        });*/
        post(inoutUrl + 'input_batch/' + batchId + '/' + storeId, undefined).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
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
    };

    renderBatchStoreForm() {
        const { getFieldDecorator } = this.props.form;
        const { stores } = this.state;

        const storeOptions = stores.map(store => (
            <Option value={store['storeId']} key={store['storeId']}>{store['name']}</Option>
        ));
        return (
            <Form layout={"inline"} onSubmit={this.handleSubmit}>
                <Form.Item label={'生产批次'}>
                    {getFieldDecorator('batchId', {
                        rules: [
                            { validator: this.checkBatch }
                        ]
                    })(<InputNumber min={0} />)}
                </Form.Item>
                <Form.Item label={'仓库'}>
                    {getFieldDecorator('storeId', {
                        initialValue: 0,
                        rules: [
                            { validator: this.checkStore }
                        ]
                    })(<Select style={{ width: 150 }}>
                        <Option value={0}>--选择仓库--</Option>
                        {storeOptions}
                    </Select>)}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        开始出库
                    </Button>
                </Form.Item>
            </Form>
        )
    }

    renderBatchStoreFormAfterBegin() {
        const { batchId, storeId, stores, allCompleted, scanLoading } = this.state;
        let selectedStore = '';
        for (let store of stores)
            if (store['storeId'] === storeId) {
                selectedStore = store['name'];
                break;
            }
        return (
            <Form layout={"inline"}>
                <Form.Item label={'生产批次'}>
                    <Alert message={batchId} />
                </Form.Item>
                <Form.Item label={'仓库'}>
                    <Alert message={selectedStore} />
                </Form.Item>
                <Form.Item>
                    { allCompleted ? (
                        <Alert message={`批次${batchId}所需${selectedStore}的原料已出库完成`} type="success" />
                    ) : (
                        <Button type="primary" loading={scanLoading} onClick={this.scanProduct}>
                            扫描原料
                        </Button>
                    )}
                </Form.Item>
            </Form>
        )
    }

    render() {
        const { batchId, scannedProducts } = this.state;

        const begin = batchId !== 0;
        const batchStoreForm = begin ? this.renderBatchStoreFormAfterBegin() : this.renderBatchStoreForm();

        return(
            <Card title={'原料出库'}>
                {batchStoreForm}
                { begin ? (
                    <Table columns={columns} dataSource={scannedProducts} />
                ) : null}
            </Card>
        )
    }
}

export default withRouter(Form.create()(RawOut));
