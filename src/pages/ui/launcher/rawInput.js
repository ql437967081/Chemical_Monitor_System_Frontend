import React from "react";
import { Select, InputNumber } from 'antd';
import {checkTokenExpiration, get} from "../../../request";
import {backend_url} from "../../../config/httpRequest1";
import ChemicalSearchInput from "../all/chemical_search_input";

const storeUrl = backend_url + 'store/';

const { Option } = Select;

let maxNumDict = {};

export default class RawInput extends React.Component {
    state ={
        stores: [],
        batches: [],
        maxNum: 0
    };

    searchStore = casId => {
        const stores = [];
        const changedState = { batches: [], maxNum: 0 };
        if (casId === 0 || casId === undefined) {
            this.setState({ stores, ...changedState });
            return
        }
        /*axios({
            method: 'get',
            url: storeUrl + 'search_by_cas/' + casId
        }).then(function (res) {
            for (let store of res.data) {
                const { storeId, name, enterpriseId } = store;
                stores.push({ storeId, name, enterpriseId });
            }
            this.setState({ stores, ...changedState });
        }.bind(this)).catch(function (err) {
            console.log(err);
            this.setState({ stores, ...changedState });
        }.bind(this));*/
        get(storeUrl + 'search_by_cas/' + casId).then(function (res) {
            if (checkTokenExpiration(res, this.props.getHistory()))
                return;
            for (let store of res.data) {
                const { storeId, name, enterpriseId, enable } = store;
                if (enable === 1)
                    stores.push({ storeId, name, enterpriseId });
            }
            this.setState({ stores, ...changedState });
        }.bind(this)).catch(function (err) {
            console.log(err);
            this.setState({ stores, ...changedState });
        }.bind(this));
    };

    searchBatch = (store, casId) => {
        const batches = [];
        maxNumDict = {};
        const changedState = { maxNum: 0 };
        if (store === 0) {
            this.setState({ batches, ...changedState });
            return;
        }
        /*axios({
            method: 'get',
            url: storeUrl + store + '/search_by_cas/' + casId
        }).then(function (res) {
            for (let product of res.data) {
                const { productId, batchId, number } = product;
                batches.push({ batchId, productId });
                maxNumDict[productId] = number;
            }
            this.setState({ batches, ...changedState })
        }.bind(this)).catch(function (err) {
            console.log(err);
            this.setState({ batches, ...changedState })
        }.bind(this));*/
        get(storeUrl + store + '/search_by_cas/' + casId).then(function (res) {
            if (checkTokenExpiration(res, this.props.getHistory()))
                return;
            for (let product of res.data) {
                const { productId, batchId, number } = product;
                batches.push({ batchId, productId });
                maxNumDict[productId] = number;
            }
            this.setState({ batches, ...changedState })
        }.bind(this)).catch(function (err) {
            console.log(err);
            this.setState({ batches, ...changedState })
        }.bind(this));
    };

    handleStoreChange = store => {
        this.triggerChange({ store, product: 0, num: 0, maxNum: 0 });
        const { casId } = this.props.value;
        this.searchBatch(store, casId)
    };

    handleBatchChange = product => {
        const maxNum = product !== 0 ? maxNumDict[product] : 0;
        this.triggerChange({ product, num: 0, maxNum });
        this.setState({ maxNum })
    };

    handleNumChange = num => {
        this.triggerChange({ num });
    };

    handleCasIdChange = casId => {
        this.triggerChange({ casId, store: 0, product: 0, num: 0, maxNum: 0 });
        this.searchStore(casId);
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
        const { size, value, enterpriseId, getHistory } = this.props;
        const { stores, batches, maxNum } = this.state;
        const storeOptions = [];
        for (let store of stores) {
            if (store['enterpriseId'] === enterpriseId || enterpriseId === 0) {
                storeOptions.push(<Option value={store['storeId']} key={store['storeId']}>{store['name']}</Option>);
            } else if (value.store === store['storeId']) {
                this.handleStoreChange(0)
            }

        }
        /*
        const storeOptions = stores.map(store => store['enterpriseId'] === enterpriseId || enterpriseId === 0 ? (
            <Option value={store['storeId']} key={store['storeId']}>{store['name']}</Option>
        ) : null);

         */
        const batchOptions = batches.map(batch => (
            <Option value={batch['productId']} key={batch['productId']}>批次{batch['batchId']}；产品编号{batch['productId']}</Option>
        ));
        return (
            <span>
                <ChemicalSearchInput
                    placeholder={'原料名称'}
                    style={{ width: '15%', marginRight: 8 }}
                    value={value.casId}
                    onChange={this.handleCasIdChange}
                    getHistory={() => getHistory}
                />
                <Select
                    value={value.store}
                    size={size}
                    style={{ width: '16%', marginRight: 8 }}
                    onChange={this.handleStoreChange}
                >
                    <Option value={0}>--选择仓库--</Option>
                    {
                        stores.length === 0 ?
                        (<Option disabled key={-1}>暂无该原料</Option>) :
                        null
                    }
                    {storeOptions}
                </Select>
                <Select
                    value={value.product}
                    size={size}
                    style={{ width: '16%', marginRight: 8 }}
                    onChange={this.handleBatchChange}
                >
                    <Option value={0}>--选择批次--</Option>
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
