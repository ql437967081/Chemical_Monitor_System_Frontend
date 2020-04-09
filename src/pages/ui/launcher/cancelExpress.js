import React from "react";
import {withRouter} from "react-router";
import {Alert, Button, Card, Form, InputNumber, message, Modal} from "antd";
import {checkTokenExpiration, get, post} from "../../../request";
import {backend_url} from "../../../config/httpRequest1";

const { confirm } = Modal;

const baseUrl = backend_url + 'express/';

const STATUS_TYPE = ['未开始', '已出库', '已入库', "出错", "出库中", "入库中"];

let timeout;
let currentValue;

class CancelExpress extends React.Component {

    state = {
        expressVO: undefined
    };

    checkExpress = (rule, value, callback) => {
        if ( value.length === 0 ) {
            return callback('请输入物流单号');
        }
        if (!/^\d+$/.test(value)) {
            return callback('请输入正确的物流单号');
        }
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        currentValue = value;
        const setState = changedState => this.setState(changedState);
        const getHistory = () => this.props.history;

        function fake() {
            /*axios({
                method: 'get',
                url: baseUrl + 'get_express/' + value
            }).then(function (res) {
                //console.log(value, currentValue);
                if (currentValue !== value) {
                    callback();
                    return;
                }
                const expressVO = res.data.data;
                if (expressVO.code === 1) {
                    setState({ expressVO });
                    callback();
                } else {
                    setState({ expressVO: undefined });
                    callback('请输入正确的物流单号');
                }
            }).catch(function (err) {
                console.log(err);
            });*/
            get(baseUrl + 'get_express/' + value).then(function (res) {
                if (checkTokenExpiration(res, getHistory()))
                    return;
                //console.log(value, currentValue);
                if (currentValue !== value) {
                    callback();
                    return;
                }
                const expressVO = res.data;
                if (expressVO.code === 1) {
                    setState({ expressVO });
                    callback();
                } else {
                    setState({ expressVO: undefined });
                    callback('请输入正确的物流单号');
                }
            }).catch(function (err) {
                console.log(err);
            });
        }
        timeout = setTimeout(fake, 300);
    };

    showConfirm = () => {
        const { expressVO } = this.state;
        if (!expressVO) {
            message.error('请输入正确的物流单号');
            return;
        }
        const { status, expressId } = expressVO;
        confirm({
            title: `是否确认取消${expressId}号物流单？`,
            content: status === 0 ?
                '本次物流单还未开始，取消后不再进行出入库操作。' :
                '本次物流单已经开始，请继续完成出入库操作，本次取消操作将自动建立一个反向物流单。'
            ,
            okText: '取消物流单',
            cancelText: '我再想想',
            onOk: () => {
                /*axios({
                    method: 'post',
                    url: baseUrl + 'reverse_express/' + expressId
                }).then(function (res) {
                    const { data } = res;
                    if (data.code === 200) {
                        message.success('取消物流单成功');
                        console.log(data.data);
                    } else {
                        message.error(data.msg);
                    }
                }).catch(function (err) {
                    console.log(err)
                });*/
                post(baseUrl + 'reverse_express/' + expressId, undefined).then(function (res) {
                    if (checkTokenExpiration(res, this.props.history))
                        return;
                    if (res.code === 200) {
                        message.success('取消物流单成功');
                        console.log(res.data);
                    } else {
                        message.error(res.msg);
                    }
                }.bind(this)).catch(function (err) {
                    console.log(err);
                });
            },
            onCancel: () => {
                console.log('Cancel');
            },
        });
    };

    renderExpressVO = () => {
        const { expressVO } = this.state;
        if (!expressVO)
            return null;
        const { status, inputStoreName, outputStoreName } = expressVO;
        const formItemLayoutWithOutLabel = {
            wrapperCol: { span: 18, offset: 6 }
        };
        const disabled = status === 2 || status === 3;
        return [
            <Form.Item key={0} label={'当前状态'}>{STATUS_TYPE[status]}</Form.Item>,
            <Form.Item key={1} label={'出库仓库'}>{outputStoreName}</Form.Item>,
            <Form.Item key={2} label={'入库仓库'}>{inputStoreName}</Form.Item>,
            <Form.Item key={3} {...formItemLayoutWithOutLabel}>
                <Button type="primary" onClick={() => this.showConfirm()} disabled={disabled}>
                    取消物流单
                </Button>
                { disabled ? <Alert message={`${STATUS_TYPE[status]}物流单不能取消`} type={"error"} style={{width: 180}} /> : null }
            </Form.Item>
        ];
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };


        return (
            <Card title={'取消物流单'}>
                <Form {...formItemLayout}>
                    <Form.Item label={'物流单号'}>
                        {getFieldDecorator(`expressId`, {
                            rules: [
                                { validator: this.checkExpress }
                            ],
                        })(<InputNumber placeholder={'请输入需要取消的物流单号'} min={0} style={{width: 210}} />)}
                    </Form.Item>
                    {this.renderExpressVO()}
                </Form>
            </Card>
        )
    }
}

export default withRouter(Form.create()(CancelExpress));
