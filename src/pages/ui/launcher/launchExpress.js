import React from "react";
import {Table, Button, Card, message} from 'antd';
import {withRouter} from "react-router";
import ExpressNumInputForm from "./expressNumInputForm";
import ExpressStoreSelectForm from "./expressStoreSelectForm";
import {checkTokenExpiration, get, post} from "../../../request";
import {backend_url} from "../../../config/httpRequest1";

const storeUrl = backend_url + 'store/';
const expressUrl = backend_url + 'express/';

class LaunchExpress extends React.Component {
    state = {
        storeOut: 0,
        storeIn: 0,
        selectedRowKeys: [],
        expressNum: {},
        allProducts: []
    };

    handleStoresChange = (storeOut, storeIn) => {
        if (storeOut === this.state.storeOut) {
            if (storeIn !== this.state.storeIn) {
                this.setState({ storeIn })
            }
            return
        }
        /*
        axios({
            method: 'get',
            url: storeUrl + storeOut + '/products'
        }).then(function (res) {
            const allProducts = [];
            for (let product of res.data) {
                const { productId, cas, batchId, number } = product;
                allProducts.push({ key: productId, name: cas.name, batch: batchId, leftNum: number });
            }
            this.setState({
                storeOut, storeIn,
                selectedRowKeys: [],
                expressNum: {},
                allProducts
            });
        }.bind(this)).catch(function (err) {
            console.log(err)
        });*/
        get(storeUrl + storeOut + '/products').then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            const allProducts = [];
            for (let product of res.data) {
                const { productId, cas, batchId, number } = product;
                allProducts.push({ key: productId, name: cas.name, batch: batchId, leftNum: number });
            }
            this.setState({
                storeOut, storeIn,
                selectedRowKeys: [],
                expressNum: {},
                allProducts
            });
        }.bind(this)).catch(function (err) {
            console.log(err)
        });
    };

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        const { expressNum } = this.state;
        let expressNumNew = {};
        for (let key of selectedRowKeys) {
            const old = expressNum[key];
            expressNumNew[key] = old ? old : 0;
        }
        this.setState({ selectedRowKeys: selectedRowKeys, expressNum: expressNumNew });
    };

    checkSelected = key => {
        const { selectedRowKeys } = this.state;
        for (let k of selectedRowKeys) {
            if (key === k)
                return true;
        }
        return false;
    };

    handleSubmit = () => {
        const { storeOut, storeIn, expressNum } = this.state;
        /*axios({
            method: 'post',
            url: expressUrl + 'create_express',
            data: {
                inputStoreId: storeIn,
                outputStoreId: storeOut,
                productNumberMap: expressNum
            }
        }).then(function (res) {
            const expressVO = res.data.data;
            if (expressVO.code === 1) {
                message.success('本次物流发起成功');
                this.setState({
                    storeOut: 0,
                    storeIn: 0,
                    selectedRowKeys: [],
                    expressNum: {},
                    allProducts: []
                })
            } else {
                message.error('服务器繁忙，请稍后重试');
            }
        }.bind(this)).catch(function (err) {
            console.log(err)
        });*/
        post(expressUrl + 'create_express', {
            inputStoreId: storeIn,
            outputStoreId: storeOut,
            productNumberMap: expressNum
        }).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            const expressVO = res.data;
            if (expressVO.code === 1) {
                message.success('本次物流发起成功');
                // todo:
                this.setState({
                    storeOut: 0,
                    storeIn: 0,
                    selectedRowKeys: [],
                    expressNum: {},
                    allProducts: []
                })
            } else {
                message.error(expressVO.message);
            }
        }.bind(this)).catch(function (err) {
            console.log(err);
            console.log(err.response);
        });
    };

    render() {
        const { storeOut, storeIn, selectedRowKeys, allProducts, expressNum } = this.state;
        console.log(expressNum);
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const data = allProducts;

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
                title: '剩余数量',
                dataIndex: 'leftNum',
                key: 'leftNum'
            },
            {
                title: '运出数量',
                key: 'expressNum',
                render: (text, record) => {
                    const key = record.key;
                    return this.checkSelected(key) ? (
                        <ExpressNumInputForm
                            initialValue={expressNum[key]} leftNum={record.leftNum}
                            onCheck={value => {
                                const changed = {};
                                changed[key] = value;
                                this.setState({
                                    expressNum: {...expressNum, ...changed}
                                })
                            }}
                        />
                    ) : null;
                }
            }
        ];

        return (
            <Card title={'发起物流'}>
                <ExpressStoreSelectForm
                    storeOut={storeOut} storeIn={storeIn}
                    onCheck={this.handleStoresChange}
                    getHistory={() => this.props.history}
                />
                <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
                <Button type="primary" onClick={this.handleSubmit}>
                    发起物流
                </Button>
            </Card>
        );
    }
}

export default withRouter(LaunchExpress);
