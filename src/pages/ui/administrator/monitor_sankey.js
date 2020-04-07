import React from 'react'
import {Card, Form, Input, message,} from 'antd'
import echarts from 'echarts/lib/echarts'
import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/tree'
import { Tooltip } from 'antd';
import axios from "axios"
import {backend_url} from "../../../config/httpRequest";

const nodes = [
    {
    name: '入园',
    depth: 0
}, {
    name: '企业A'
}, {
    name: '企业B',
    depth: 1
}, {
    name: '企业C'
}, {
    name: '企业D'
}, {
    name: '出园'
},{
    name: '被使用'
}];

const nodes1 = [
    {name: '批次1\n原料C'},
    {name: '批次1'},
    {name: '批次1\n产品B'},
    {name: '批次1\n产品B\n从仓库1运到仓库2'},
    {name: '批次2\n原料B'},

    {name: '批次4\n原料E'},
    {name: '批次4\n原料F'},
    {name: '批次4\n原料G'},
    {name: '批次4'},
    {name: '批次4\n产品D'},
    {name: '批次4\n产品D\n从仓库3运到仓库4'},
    {name: '批次2\n原料D'},

    {name: '批次3\n原料I'},
    {name: '批次3'},
    {name: '批次3\n产品H'},
    {name: '批次3\n产品H\n从仓库3运到仓库4'},
    {name: '批次2\n原料H'},

    {name: '批次2'},
    {name: '批次2\n产品A'},
    {name: '批次2\n产品P'},
];

const linkss = [
    {
    source: '入园',
    target: '企业A',
    value: 10
}, {
    source: '企业A',
    target: '企业D',
    value: 8
}, {
    source: '企业D',
    target: '出园',
    value: 5
},{
    source: '企业D',
    target: '被使用',
    value: 3
},{
    source: '企业A',
    target: '企业C',
    value: 2
}, {
    source: '入园',
    target: '企业C',
    value: 1
},{
    source: '企业B',
    target: '企业C',
    value: 4
},{
    source: '企业C',
    target: '被使用',
    value: 7
}];

const linkss1 = [
    {source: '批次1\n原料C', target: '批次1', value: 100},
    {source: '批次1', target: '批次1\n产品B', value: 100},
    {source: '批次1\n产品B', target: '批次1\n产品B\n从仓库1运到仓库2', value: 30},
    {source: '批次1\n产品B\n从仓库1运到仓库2', target: '批次2\n原料B', value: 30},

    {source: '批次4\n原料E', target: '批次4', value: 40},
    {source: '批次4\n原料F', target: '批次4', value: 40},
    {source: '批次4\n原料G', target: '批次4', value: 20},
    {source: '批次4', target: '批次4\n产品D', value: 100},
    {source: '批次4\n产品D', target: '批次4\n产品D\n从仓库3运到仓库4', value: 50},
    {source: '批次4\n产品D\n从仓库3运到仓库4', target: '批次2\n原料D', value: 50},

    {source: '批次3\n原料I', target: '批次3', value: 100},
    {source: '批次3', target: '批次3\n产品H', value: 100},
    {source: '批次3\n产品H', target: '批次3\n产品H\n从仓库3运到仓库4', value: 20},
    {source: '批次3\n产品H\n从仓库3运到仓库4', target: '批次2\n原料H', value: 20},

    {source: '批次2\n原料B', target: '批次2', value: 30},
    {source: '批次2\n原料D', target: '批次2', value: 50},
    {source: '批次2\n原料H', target: '批次2', value: 20},
    {source: '批次2', target: '批次2\n产品A', value: 100},
    {source: '批次2', target: '批次2\n产品P', value: 100},
];

const FormItem = Form.Item
const Search = Input.Search

const baseUrl = backend_url + 'batch_info/';

const sep = ' ';
//echarts的桑基图
export default class Monitor_sankey extends React.Component{

    state = {
        option: this.getOption(),
        option2: this.getOption()
    };

    componentWillUnmount() {
        echarts.registerTheme('测试',echarts)
    }

    addExpressInNodesAndLinks(nodes, links, expressInInfo, store_node) {
        const fromStoreInfo = expressInInfo['fromStoreInfo'];
        const from_store_node = '批次' + fromStoreInfo['productBatchId'] +
            sep + '产品' + fromStoreInfo['productName'] +
            sep + '仓库' + fromStoreInfo['storeName'];
        nodes.add(from_store_node);
        links.add({
            source: from_store_node,
            target: store_node,
            value: expressInInfo['expressNum']
        });

        if (fromStoreInfo['expressIn']) {
            this.addExpressInNodesAndLinks(nodes, links, fromStoreInfo['expressInInfo'], from_store_node)
        }
        else {
            this.addBatchInNodesAndLinks(nodes, links, fromStoreInfo['batchInInfo'], from_store_node)
        }
    }

    addBatchInNodesAndLinks(nodes, links, batchInInfo, store_node) {
        const productUseInfoList = batchInInfo['productUseInfoList']
        let batch_node = '批次' + batchInInfo['batchId'];
        if (productUseInfoList.length === 0) {
            batch_node = '入园' + batch_node
        }
        nodes.add(batch_node);
        links.add({
            source: batch_node,
            target: store_node,
            value: batchInInfo['num']
        });
        this.addProductUseListNodesAndLinks(nodes, links, productUseInfoList, batch_node)
    }

    addProductUseListNodesAndLinks(nodes, links, productUseInfoList, batch_node) {
        for (let productUseInfo of productUseInfoList) {
            const fromStoreInfo = productUseInfo['fromStoreInfo'];
            const productName = fromStoreInfo['productName'];
            /*const raw_node = batch_node +
                sep + '原料' + productName;
            nodes.add(raw_node);
            links.add({
                source: raw_node,
                target: batch_node,
                value: productUseInfo['num']
            });

             */
            const store_node = '批次' + fromStoreInfo['productBatchId'] +
                sep + '产品' + productName +
                sep + '仓库' + fromStoreInfo['storeName'];
            nodes.add(store_node);
            links.add({
                source: store_node,
                target: batch_node,
                value: productUseInfo['num']
            });
            if (fromStoreInfo['expressIn']) {
                this.addExpressInNodesAndLinks(nodes, links, fromStoreInfo['expressInInfo'], store_node)
            }
            else {
                this.addBatchInNodesAndLinks(nodes, links, fromStoreInfo['batchInInfo'], store_node)
            }
        }
    }

    addExpressOutNodesAndLinks(nodes, links, expressOutInfo, product_node) {
        const toStoreInfo = expressOutInfo['toStoreInfo'];
        const productName = toStoreInfo['productName'];
        const to_store_node = '批次' + toStoreInfo['productBatchId'] +
            sep + '产品' + productName +
            sep + '仓库' + toStoreInfo['storeName'];
        nodes.add(to_store_node);
        links.add({
            source: product_node,
            target: to_store_node,
            value: expressOutInfo['expressNum']
        });
        this.addProductWhereaboutsInfoListNodesAndLinks(nodes, links, toStoreInfo, to_store_node, productName)
    }

    addBatchOutNodesAndLinks(nodes, links, batchOutInfo, product_node, productName) {
        const productInfoList = batchOutInfo['productInfoList'];
        const batch_node = '批次' + batchOutInfo['batchId'];
        /*const raw_node = batch_node +
            sep + '原料' + productName;
        nodes.add(raw_node);
        links.add({
            source: product_node,
            target: raw_node,
            value: batchOutInfo['num']
        });

         */
        nodes.add(batch_node);
        links.add({
            source: product_node,
            target: batch_node,
            value: batchOutInfo['num']
        });
        this.addProductListNodesAndLinks(nodes, links, batchOutInfo['productInfoList'], batch_node)
    }

    addProductWhereaboutsInfoListNodesAndLinks(nodes, links, toStoreInfo, product_node, productName) {
        for (let productWhereaboutsInfo of toStoreInfo['productWhereaboutsInfoList']) {
            if (productWhereaboutsInfo['expressOut']) {
                this.addExpressOutNodesAndLinks(nodes, links, productWhereaboutsInfo, product_node)
            }
            else {
                this.addBatchOutNodesAndLinks(nodes, links, productWhereaboutsInfo, product_node, productName)
            }
        }
    }

    addProductListNodesAndLinks(nodes, links, productInfoList, batch_node) {
        for (let productInfo of productInfoList) {
            const toStoreInfo = productInfo['toStoreInfo'];
            const productName = toStoreInfo['productName'];
            const product_node = batch_node +
                sep + '产品' + productName +
                sep + '仓库' + toStoreInfo['storeName'];
            nodes.add(product_node);
            links.add({
                source: batch_node,
                target: product_node,
                value: productInfo['num']
            });
            this.addProductWhereaboutsInfoListNodesAndLinks(nodes, links, toStoreInfo, product_node, productName)
        }
    }

    parseRawData(data) {
        let nodes = new Set();
        let links = new Set();
        const batch_node = '批次' + data['batchId'];
        nodes.add(batch_node);
        this.addProductUseListNodesAndLinks(nodes, links, data['productUseInfoList'], batch_node);

        let nodesArray = [];
        for (let node of nodes) {
            nodesArray.push({ name: node })
        }

        return { 'nodes': nodesArray, 'links': Array.from(links) }
    }

    parseProductData(data) {
        let nodes = new Set();
        let links = new Set();
        const batch_node = '批次' + data['batchId'];
        nodes.add(batch_node);

        this.addProductListNodesAndLinks(nodes, links, data['productInfoList'], batch_node);

        let nodesArray = [];
        for (let node of nodes) {
            nodesArray.push({ name: node })
        }

        return { 'nodes': nodesArray, 'links': Array.from(links) }
    }

    searchBatch = (value) => {
        if (!/^\d+$/.test(value)) {
            message.error('请输入正确的批次');
            return
        }
        axios({
            method: 'get',
            url: baseUrl + 'batch_' + value
        }).then(function (res) {
            const parsedRawData = this.parseRawData(res.data);
            const parsedProductData = this.parseProductData(res.data);
            //*
            this.setState({
                option: this.getOption(parsedRawData['nodes'], parsedRawData['links']),
                option2: this.getOption(parsedProductData['nodes'], parsedProductData['links'], '产品用途')
            })//*/
        }.bind(this)).catch(function (err) {
            console.log(err)
        })
    };

    getOption (dt=nodes1, lk=linkss1, title_text='原料历史') {
        let option = {
            title: {
                text: title_text
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
                    data: dt,
                    links: lk,
                    lineStyle: {
                        normal: {
                            color: 'source',
                            curveness: 0.5
                        }
                    }
                }
            ]
        };
        return option
    }

    render(){
        return(
            <div>
                <Card title={"危害化学品生命周期查询"}>

                    <Form layout={"inline"}>
                        <FormItem label={"请输入批次id以查询其生命周期"}>
                            <Search placeholder="请输入批次id"
                                    enterButton onSearch={this.searchBatch} />
                        </FormItem>
                    </Form>
                    <ReactEcharts option={this.state.option}/>
                    <ReactEcharts option={this.state.option2}/>
                </Card>
            </div>
        )
    }
}
