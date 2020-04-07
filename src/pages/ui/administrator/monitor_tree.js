import React from 'react'
import {Card, Select, Form, Input, message, FormItem, InputNumber, Button,} from 'antd'
import echarts from 'echarts/lib/echarts'
import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/tree'
import data from './data'
import {withRouter} from "react-router";
import axios from "axios"
import {backend_url} from "../../../config/httpRequest";

const baseUrl = backend_url + 'product_history/';

//echarts的树图 不过只有name children value的值 不能体现产品从一个点的过程 边是不能被编辑的
//https://www.echartsjs.com/zh/option.html#series
//可以在echarts网站上的配置页面查看如何配置
//数据存在文件夹./data.json中
class Monitor_tree extends React.Component{
    state = {
        option: this.getOption()
    };

    getOption (dt=data) {
        let option = {
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            toolbox:{
                feature:{
                    saveAsImage:{},
                    restore:{},
                    dataView: {readOnly: true},
                }
            },
            top: '1%',
            left: '15%',
            bottom: '1%',
            right: '7%',
            symbolSize: 7,

            orient: 'RL',

            label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
            },

            leaves: {
                label: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right'
                }
            },

            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
            series: [
                {
                    type: 'tree',
                    roam: 'true',
                    orient:'RL',
                    focusNodeAdjacency: 'allEdges',
                    nodeAlign: 'left',
                    data: [dt]
                }
            ]
        };
        return option
    };

    parseData(data) {
        const children = data.children
        if (children) {
            let cn = [];
            for (let child of children)
                cn.push(this.parseData(child))
            return { name: data.name + ': ' + data.num, children: cn }
        }
        return { name: data.name + ': ' + data.num }
    }

    searchComposition = () => {
        this.props.form.validateFields((err,values)=>{
            if (err)
                message.error(err);
            else {
                console.log(values);
                axios({
                    method: 'get',
                    url: baseUrl + 'composition_info/batch_' + values['batchId'] + '/cas_' + values['casId']
                }).then(function (res) {
                    console.log(res.data);
                    if (res.data) {
                        this.setState({
                            option: this.getOption(this.parseData(res.data))
                        })
                    } else {
                        message.error('查询失败，请稍后重试！')
                    }
                }.bind(this)).catch(function (err) {
                    console.log(err)
                })
            }
        });
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <div >
                <Card title={"危害化学品流程监控"}>
                    <Form layout={"inline"} onSubmit={this.searchComposition}>
                        <Form.Item label={"请输入产品的批次id和cas码以查询其合成历史"}>
                            {getFieldDecorator('batchId', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入批次id!',
                                    }
                                ],
                            })(<InputNumber min={0} placeholder="批次id" />)}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('casId', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入cas码!',
                                    }
                                ],
                            })(<InputNumber min={0} placeholder="cas码" />)}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">查找</Button>
                        </Form.Item>
                    </Form>
                    <ReactEcharts  option={this.state.option}/>
                </Card>
            </div>
        )
    }
}
export default withRouter(Form.create()(Monitor_tree));
