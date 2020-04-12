import React from "react";
import {withRouter} from "react-router";
import {Card, Form, Input, message} from "antd";
import ReactEcharts from 'echarts-for-react';
import {checkTokenExpiration, get} from "../../../request";
import {backend_url} from "../../../config/httpRequest1";

const baseUrl = backend_url + 'history/';
const { Search } = Input;
const sep = ' ';

const BATCH_TYPE = ['', '入园', '出园', '销毁'];

class BatchInfo extends React.Component{

    state = {
        searchLoading: false,
        raws: null,
        products: null
    };

    search = value => {
        if ( value.length === 0 ) {
            message.error('请输入批次id');
            return;
        }
        if (!/^\d+$/.test(value)) {
            message.error('请输入正确的批次id');
            return;
        }
        this.setState({ searchLoading: true });
        /*axios({
            method: 'get',
            url: baseUrl + 'batch_' + value
        }).then(function (res) {
            const { data } = res;
            console.log(data);
            if (data['code'] !== 200) {
                message.error(data['msg']);
            }
            this.setState({ ...data['data'], searchLoading: false });
        }.bind(this)).catch(function (err) {
            console.log(err);
        });*/
        get(baseUrl + 'batch_' + value).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            const data = res;
            console.log(data);
            if (data['code'] !== 200) {
                message.error(data['msg']);
            }
            this.setState({ ...data['data'], searchLoading: false });
        }.bind(this)).catch(function (err) {
            console.log(err);
        });
    };

    parseData = graph => {
        const { nodes, links } = graph;
        const parsedNodes = [];
        const parsedLinks = [];
        const nodeSet = new Set();
        for (let node of nodes) {
            const { batchId, productName, storeName, type, batchType } = node;
            const batchName = '批次' + batchId;
            if (type === 1) {
                node['name'] = batchName
                    + sep + productName
                    + sep + storeName;
            } else if (type === 2) {
                node['name'] = BATCH_TYPE[batchType] + batchName;
            }
            let { name } = node;
            while (nodeSet.has(name)) {
                name = name + ' ';
                node['name'] = name;
            }
            nodeSet.add(name);
            parsedNodes.push({ name: node['name'] });
        }
        for (let link of links) {
            const { from, to, number } = link;
            parsedLinks.push({ source: nodes[from]['name'], target: nodes[to]['name'], value: number });
        }
        console.log('nodes', parsedNodes);
        console.log('links', parsedLinks);
        return { data: parsedNodes, links: parsedLinks };
    };

    getOption = (graph, text) => {
        const { data, links } = this.parseData(graph);
        return {
            title: {
                text
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove',
                extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
            },
            toolbox:{
                feature:{
                    saveAsImage:{},
                    restore:{},
                    dataView: {readOnly: true},
                }
            },
            textStyle:{
                fontSize:'18'
            },
            itemStyle:{
                borderWidth:'0',
            },
            lineStyle:{
                opacity:'0.5'
            },
            focusNodeAdjacency:'true',
            animation: true,
            series: [
                {

                    type: 'sankey',
                    focusNodeAdjacency: 'allEdges',
                    nodeAlign: 'left',
                    data,
                    links,
                    lineStyle: {
                        normal: {
                            color: 'source',
                            curveness: 0.5
                        }
                    }
                }
            ]
        };
    };

    checkEmptyGragh = graph => {
        if (!graph)
            return true;
        const { nodes, links } = graph;
        return nodes.length === 0 || links.length === 0;

    };

    render() {
        const { searchLoading, raws, products } = this.state;
        const rawsChart = this.checkEmptyGragh(raws) ? null :
            (<ReactEcharts option={this.getOption(raws, '原料历史')} />);
        const productsChart = this.checkEmptyGragh(products) ? null :
            (<ReactEcharts option={this.getOption(products, '产品用途')} />);
        return (
            <div>
                <Card title={'危害化学品生命周期查询'}>
                    <Form layout={"inline"}>
                        <Form.Item label={"请输入批次id以查询其生命周期"}>
                            <Search
                                placeholder="请输入批次id"
                                onSearch={value => this.search(value)}
                                loading={searchLoading}
                                enterButton
                            />
                        </Form.Item>
                    </Form>
                    {rawsChart}
                    {productsChart}

                </Card>
            </div>
        );
    }
}

export default withRouter(BatchInfo);
