import React from "react";
import { InputNumber, Select } from 'antd';
import {backend_url} from "../../../config/httpRequest1";
import {checkTokenExpiration, get} from "../../../request";
import ChemicalSearchInput from "../all/chemical_search_input";

const { Option } = Select;

const storeUrl = backend_url + 'store/';

export default class ProductInput extends React.Component {
    state ={
        stores: []
    };

    componentDidMount () {
        /*
        axios({
            method: 'get',
            url: storeUrl
        }).then(function (res) {
            const stores = [];
            for (let store of res.data) {
                const { storeId, name, enterpriseId } = store;
                stores.push({ storeId, name, enterpriseId });
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
                if (enable === 1)
                    stores.push({ storeId, name, enterpriseId });
            }
            this.setState({ stores });
        }.bind(this)).catch(function (err) {
            console.log(err)
        });
    }

    handleStoreChange = store => {
        this.triggerChange({ store });
    };

    handleNumChange = num => {
        this.triggerChange({ num });
    };

    handleCasIdChange = casId => {
        this.triggerChange({ casId });
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
        const { stores } = this.state;
        const storeOptions = [];
        for (let store of stores) {
            if (store['enterpriseId'] === enterpriseId || enterpriseId === 0) {
                storeOptions.push(<Option value={store['storeId']} key={store['storeId']}>{store['name']}</Option>);
            } else if (value.store === store['storeId']) {
                this.handleStoreChange(0)
            }

        }
        /*
        const storeOptions = stores.map(store => (
            <Option value={store['storeId']} key={store['storeId']}>{store['name']}</Option>
        ));

         */
        return (
            <span>
                <ChemicalSearchInput
                    placeholder={'产品名称'}
                    style={{ width: '15%', marginRight: 8 }}
                    value={value.casId}
                    onChange={this.handleCasIdChange}
                    getHistory={getHistory}
                />
                <Select
                    value={value.store}
                    size={size}
                    style={{ width: '16%', marginRight: 8 }}
                    onChange={this.handleStoreChange}
                >
                    <Option value={0}>--选择仓库--</Option>
                    {storeOptions}
                </Select>
                <InputNumber
                    min={0}
                    value={value.num}
                    style={{ width: '10%', marginRight: 8 }}
                    onChange={this.handleNumChange}
                />
            </span>
        );
    }
}
