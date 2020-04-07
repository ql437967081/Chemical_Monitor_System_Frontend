import React from "react";
import '../../home/index.less'
import {Steps, Button, message, Card, Radio, Form, Select, Input, Descriptions, Alert, Spin, Icon, Result} from "antd";
import './store.css'

const  {Step} = Steps
const FormItem = Form.Item
const {Option}  = Select
const steps=[
    {
        title:'有无RFID'
    },{
        title:'填写产品相关信息'
    },{
        title:'生成RFID信息'
    },{
        title:'申请入库'
    },{
        title:'申请结果'
    },{
        title:'产品入库'
    },{
        title:'确认全部入库后结束入库'
    }
]

const antIcon = <Icon type={"loading"} style={{fontSize:'36px'}} spin />


class StockIn extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            current:0,
            value:1,
            timeout:0,
        };
        this.set.bind(this)
    }
    next(){
        const current = this.state.current + 1;
        this.setState({current})
    }

    nextwithrfid(){
        const current = this.state.current + 3;
        this.setState({current})
    }

    prev(){
        const current = this.state.current - 1;
        this.setState({current})
    }

    set(){
        setTimeout(function () {
            this.setState({timeout:1})
        }.bind(this),3000);
    }

    componentWillUnmount() {
        clearTimeout(this.state.timeout);
    }

    nextwithstate(){
        if(this.state.value === 1){
            this.nextwithrfid();
        }else {
            this.next();
        }
    }

    prevwithrfid(){
        const current = this.state.current - 3;
        this.setState({current})
    }

    prevwithstate(){
        if(this.state.value === 1){
            this.prevwithrfid();
        }else {
            this.prev();
        }
    }

    onChange = e =>{
        this.setState({
            value:e.target.value
        })
    }

    render() {

        const formItemLayout = {
            labelCol: {
                xs: { span: 24},
                sm: { span: 11 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
        };

        const radioStyle = {
            fontWeight:'bold',
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        const {current} = this.state;
        const {timeout} = this.state;
        return(
            <div>
                <Card title={"入库场景管理"} headStyle={{textAlign:"center",fontWeight:"bolder"}}>
                    <Steps current={current}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </Steps>
                    <div>
                        {current === 0 &&(
                            <div className="steps-content">
                                <Radio.Group onChange={this.onChange} value={this.state.value}>
                                    <Radio style={radioStyle} value={1}>
                                        有RFID（有则跳过2、3两步）
                                    </Radio>
                                    <br />
                                    <br />
                                    <br />
                                    <Radio style={radioStyle} value={2}>
                                        无RFID（即产品从园区外进入）
                                    </Radio>
                                </Radio.Group>
                            </div>
                        )}
                        {current === 1 &&(
                            <div className="steps-content">
                                <Form {...formItemLayout}>
                                    <FormItem label={"危害元素"}>
                                        <Select style={{width:"120px",textAlign:"center"}} dropdownStyle={{textAlign:"center"}} placeholder={"Element"}>
                                            <Option value={"Au"}>金(Au)</Option>
                                            <Option value={"Hg"}>汞(Hg)</Option>
                                            <Option value={"Ag"}>银(Ag)</Option>
                                            <Option value={"Cu"}>铜(Cu)</Option>
                                            <Option value={"Cr"}>铬（Cr）</Option>
                                            <Option value={"Pb"}>铅（Pt）</Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label={"产品批次"}>
                                        <Input  allowClear className={"input-action"} style={{textAlign:"center"}} placeholder={"批次格式"}/>
                                    </FormItem>
                                    <FormItem label={"生产厂商（或生产人员）"}>
                                        <Input  allowClear className={"input-action"} style={{textAlign:"center"}} placeholder={"例如：企业A或producer"}/>
                                    </FormItem>
                                </Form>
                            </div>
                        )}{current === 2 &&(
                            <div className="steps-content1">
                                <Descriptions title={"对应RFID信息"} bordered column={2}>
                                    <Descriptions.Item label={"RFID"}>RFID编码</Descriptions.Item>
                                    <Descriptions.Item label={"产品批次"}>批次编码</Descriptions.Item>
                                    <Descriptions.Item label={"危害元素"}>Cu</Descriptions.Item>
                                    <Descriptions.Item label={"生产厂商"}>企业A</Descriptions.Item>
                                </Descriptions>
                                <br/>
                                <br/>
                                <br/>
                                <Alert message={"提示"} description={"请将系统生成的RFID信息贴至对应的产品上，贴好后请点击下一步。"} type={"info"} showIcon/>
                            </div>
                    )}{current === 3 &&(
                        <div className="steps-content2">
                            <Form {...formItemLayout}>
                                <FormItem label={"请输入需要申请入库产品的RFID"}>
                                    <Input  allowClear className={"input-action"} style={{textAlign:"center"}} placeholder={"RFID"}/>
                                    <br/>
                                </FormItem>
                            </Form>
                        </div>
                    )}{current === 4 && timeout === 0&&(
                       <div className={"steps-content2"}>
                           {this.set()}
                           <Spin tip={"申请正在处理中....请耐心等待"} delay={"50"} indicator={antIcon} />
                       </div>
                    )}{current === 4 && timeout === 1&&(
                        <div className={"steps-content"}>
                            <Result status={"success"} title={"申请成功，请点击下一步按钮"}/>
                        </div>
                    )}{current === 5 &&(
                        <div className="steps-content1">
                            <Alert message={"产品入库"} description={"请将产品通过RFID扫描门运入仓库，完成后请点击下一步。"} type={"info"} style={{marginTop:"5%",width:"80%",marginLeft:"10%"}} showIcon/>
                        </div>
                    )}{current === 6 &&(
                        <div className="steps-content1">
                            <Alert message={"结束入库"} description={"请确认本次需要入库的产品全部入库后，点击结束入库按钮。"} type={"info"} style={{marginTop:"5%",width:"80%",marginLeft:"10%"}} showIcon/>
                        </div>
                    )}{current === 7 &&(
                        <div className="steps-content">
                            <div>
                                <Result status={"success"} title={"入库成功,如需继续操作请刷新页面。"}/>
                            </div>
                        </div>
                    )}
                    <div className="steps-action">
                        {current === 0 && (
                            <Button type="primary" onClick={() => this.nextwithstate()}>
                                下一步
                            </Button>
                        )}
                        {current < 4 && current>0 && (
                            <Button type="primary" onClick={() => this.next()}>
                                下一步
                            </Button>
                        )}
                        {current > 4 && current < 6 && (
                            <Button type="primary" onClick={() => this.next()}>
                                下一步
                            </Button>
                        )}
                        {current === 4 && timeout === 0 && (
                            <Button type="primary disabled">
                                下一步
                            </Button>
                        )}
                        {current === 4 && timeout === 1 && (
                            <Button type="primary" onClick={() => this.next()}>
                                下一步
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={() => this.next()}>
                                结束入库
                            </Button>
                        )}
                        {current > 0 && current< 3 && (
                            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                上一步
                            </Button>
                        )}
                        {current > 3 && current< 6 && (
                            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                上一步
                            </Button>
                        )}
                        {current === 3 &&(
                            <Button style={{ marginLeft: 8 }} onClick={() => this.prevwithstate()}>
                                上一步
                            </Button>
                        ) }
                    </div>
                    </div>
                </Card>
            </div>
        )
    }
}

export default StockIn