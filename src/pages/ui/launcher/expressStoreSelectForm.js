import React from "react";
import {Form, Select} from "antd";
import {checkTokenExpiration, get} from "../../../request";
import {backend_url} from "../../../config/httpRequest1";

const { Option } = Select;

const baseUrl = backend_url + 'store/';

class StoresSelect extends React.Component {
    state ={
        stores: []
    };

    componentDidMount () {
        /*axios({
            method: 'get',
            url: baseUrl
        }).then(function (res) {
            const stores = [];
            for (let store of res.data) {
                const { storeId, name } = store;
                stores.push({ storeId, name });
            }
            this.setState({ stores });
        }.bind(this)).catch(function (err) {
            console.log(err)
        });*/
        get(baseUrl).then(function (res) {
            if (checkTokenExpiration(res, this.props.getHistory()))
                return;
            const stores = [];
            for (let store of res.data) {
                const { storeId, name, enable } = store;
                if (enable === 1)
                    stores.push({ storeId, name });
            }
            this.setState({ stores });
        }.bind(this)).catch(function (err) {
            console.log(err)
        });
    }

    handleStoreOutChange = storeOut => {
        this.triggerChange({ storeOut });
    };

    handleStoreInChange = storeIn => {
        this.triggerChange({ storeIn });
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
        const { storeOut, storeIn } = value;
        const { stores } = this.state;
        const storeOptions = stores.map(store => (
            <Option value={store['storeId']} key={store['storeId']}>{store['name']}</Option>
        ));
        return (
            <span>
                从
                <Select
                    value={storeOut}
                    size={size}
                    style={{ width: '16%', marginLeft: 8, marginRight: 8 }}
                    onChange={this.handleStoreOutChange}
                >
                    <Option value={0}>--选择仓库--</Option>
                    {storeOptions}
                </Select>
                运输到
                <Select
                    value={storeIn}
                    size={size}
                    style={{ width: '16%', marginLeft: 8, marginRight: 8 }}
                    onChange={this.handleStoreInChange}
                >
                    <Option value={0}>--选择仓库--</Option>
                    {storeOptions}
                </Select>
            </span>
        );
    }
}

class ExpressStoreSelectForm extends React.Component {

    check = (rule, value, callback) => {
        const { onCheck } = this.props;
        const { storeOut, storeIn } = value;
        if (storeOut === 0) {
            return callback('请选择运出仓库');
        }
        if (storeIn === 0) {
            return callback('请选择目的仓库');
        }
        if (storeIn === storeOut) {
            return callback('两个仓库不能相同');
        }
        callback();
        onCheck(storeOut, storeIn);
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { storeOut, storeIn, getHistory } = this.props;
        return (
            <Form>
                <Form.Item>
                    {getFieldDecorator(`stores`, {
                        validateTrigger: ['onChange'],
                        initialValue: { storeOut, storeIn },
                        rules: [{ validator: this.check }]
                    })(<StoresSelect getHistory={getHistory} />)}
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(ExpressStoreSelectForm)
