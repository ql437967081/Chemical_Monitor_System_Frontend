import React from "react";
import { message, Select } from 'antd';
import {backend_url} from "../../../config/httpRequest1";
import {checkTokenExpiration, get} from "../../../request";

const baseUrl = backend_url + 'cas/';

const { Option } = Select;

let timeout;
let currentSearchText;

function fetch(searchText, callback, getHistory) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentSearchText = searchText;

    function fake() {
        /*
        axios({
            method: 'get',
            url: baseUrl + 'search_cas/' + searchText
        }).then(function (res) {
            if (currentSearchText !== searchText) {
                return;
            }
            const { code, msg, data } = res.data;
            if (code !== 200) {
                message.error(msg);
            } else {
                const casList = [];
                data.forEach(cas => {
                    const { casId, name } = cas;
                    casList.push({ casId, name });
                });
                callback(casList);
            }
        }).catch(function (err) {
            console.log(err)
        });
        */
        get(baseUrl + 'search_cas/' + searchText).then(function (res) {
            if (checkTokenExpiration(res, getHistory()))
                return;
            if (currentSearchText !== searchText) {
                return;
            }
            const { code, msg, data } = res;
            if (code !== 200) {
                message.error(msg);
            } else {
                const casList = [];
                data.forEach(cas => {
                    const { casId, name } = cas;
                    casList.push({ casId, name });
                });
                callback(casList);
            }
        }).catch(function (err) {
            console.log(err)
        });
    }

    timeout = setTimeout(fake, 300);
}

export default class ChemicalSearchInput extends React.Component{
    state = {
        casList: [],
        initialCasList: []
    };

    componentWillReceiveProps(nextProps, nextContext) {
        const { getInitialCasList, value } = nextProps;

        if (getInitialCasList && value === undefined) {
            const casList = [];
            const casDict = getInitialCasList();
            for (let casId in casDict) {
                casList.push({ casId: parseInt(casId), name: casDict[casId] });
            }
            this.setState({ casList, initialCasList: casList });
        }
    }

    handleSearch = searchText => {
        if (searchText && searchText.length > 0) {
            const { getHistory } = this.props;
            fetch(searchText, casList => this.setState({ casList }), getHistory);
        } else {
            const { initialCasList } = this.state;
            this.setState({ casList: initialCasList });
        }
    };

    handleChange = value => {
        const { onChange } = this.props;
        onChange(value);
    };

    render() {
        const { casList } = this.state;
        const { placeholder, style, value } = this.props;
        const options = casList.map(cas => {
            const { casId, name } = cas;
            return (
                <Option key={casId} value={casId}>{name}</Option>
            );
        });
        return (
            <Select
                showSearch
                allowClear
                value={value}
                placeholder={placeholder}
                style={style}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={this.handleSearch}
                onChange={this.handleChange}
                notFoundContent={null}
            >
                {options}
            </Select>
        );
    }
}
