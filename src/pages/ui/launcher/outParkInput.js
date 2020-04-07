import React from "react";
import {Select, InputNumber} from 'antd';
import {checkTokenExpiration, get} from "../../../request";
import {backend_url} from "../../../config/httpRequest1";

const { Option } = Select;

const storeUrl = backend_url + 'store/';

let maxNumDict = {}, enterpriseIdDict = {};

export default class OutParkInput extends React.Component {
    state ={
        stores: [],
        batches: [],
        maxNum: 0
    };

    componentDidMount () {
        enterpriseIdDict[0] = 0;
        /*
        axios({
            method: 'get',
            url: storeUrl
        }).then(function (res) {
            const stores = [];
            for (let store of res.data) {
                const { storeId, name, enterpriseId } = store;
                stores.push({ storeId, name });
                enterpriseIdDict[storeId] = enterpriseId;
            }
            this.setState({ stores });
        }.bind(this)).catch(function (err) {
            console.log(err)
        });
        */
        get(storeUrl).then(function (res) {
            if (checkTokenExpiration(res, this.props.getHistory()))
                return;
            const stores = [];
            for (let store of res.data) {
                const { storeId, name, enterpriseId, enable } = store;
                if (enable === 1) {
                    stores.push({ storeId, name });
                    enterpriseIdDict[storeId] = enterpriseId;
                }
            }
            this.setState({ stores });
        }.bind(this)).catch(function (err) {
            console.log(err)
        });
    }

    searchProduct = (store) => {
        const batches = [];
        maxNumDict = {};
        if (store === 0) {
            this.setState({ batches, maxNum: 0 });
            return;
        }
        /*
        axios({
            method: 'get',
            url: storeUrl + store + '/products'
        }).then(function (res) {
            for (let product of res.data) {
                const { productId, cas, batchId, number } = product;
                batches.push({ productId, productName: cas.name, batchId });
                maxNumDict[productId] = number;
            }
            this.setState({ batches, maxNum: 0 });
        }.bind(this)).catch(function (err) {
            console.log(err);
            this.setState({ batches, maxNum: 0 });
        }.bind(this));*/
        get(storeUrl + store + '/products').then(function (res) {
            if (checkTokenExpiration(res, this.props.getHistory()))
                return;
            for (let product of res.data) {
                const { productId, cas, batchId, number } = product;
                batches.push({ productId, productName: cas.name, batchId });
                maxNumDict[productId] = number;
            }
            this.setState({ batches, maxNum: 0 });
        }.bind(this)).catch(function (err) {
            console.log(err);
            console.log(err.response);
            this.setState({ batches, maxNum: 0 });
        }.bind(this));
    };

    handleStoreChange = store => {
        this.triggerChange({ store, product: 0, num: 0, maxNum: 0, enterpriseId: enterpriseIdDict[store] });
        this.searchProduct(store)
    };

    handleProductChange = product => {
        const maxNum = product !== 0 ? maxNumDict[product] : 0;
        this.triggerChange({ product, num: 0, maxNum });
        this.setState({ maxNum })
    };

    handleNumChange = num => {
        this.triggerChange({ num });
    };

    triggerChange = changedValue => {
        const { onChange, value } = this.props;
        if (onChange) {
            onChange({
                ...value,
                ...changedValue,
            });
        }
    };

    render() {
        const { size, value } = this.props;
        const { stores, batches, maxNum } = this.state;
        const storeOptions = stores.map(store => (
            <Option value={store['storeId']} key={store['storeId']}>{store['name']}</Option>
        ));
        const batchOptions = batches.map(batch => (
            <Option value={batch['productId']} key={batch['productId']}>{batch['productName']}（批次{batch['batchId']}；产品编号{batch['productId']}）</Option>
        ));
        return (
            <span>
                <Select
                    value={value.store}
                    size={size}
                    style={{ width: '16%', marginRight: 8 }}
                    onChange={this.handleStoreChange}
                >
                    <Option value={0}>--选择仓库--</Option>
                    {storeOptions}
                </Select>
                <Select
                    value={value.product}
                    size={size}
                    style={{ width: '32%', marginRight: 8 }}
                    onChange={this.handleProductChange}
                >
                    <Option value={0}>--选择产品--</Option>
                    {batchOptions}
                </Select>
                <InputNumber
                    min={0} max={maxNum}
                    value={value.num}
                    style={{ width: '10%' }}
                    onChange={this.handleNumChange}
                />/
                <InputNumber
                    value={maxNum} disabled
                    style={{ width: '5%', marginRight: 8 }}
                />
            </span>
        );
    }
}
