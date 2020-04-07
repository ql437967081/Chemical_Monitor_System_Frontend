import React from "react";
import '../../home/index.less'
import {Steps, Button, message, Card, Radio, Form, Select, Input, Descriptions, Alert, Spin, Icon, Result} from "antd";
import './store.css'

const  {Step} = Steps
const FormItem = Form.Item
const {Option}  = Select
const steps=[
    {
        title:'申请出库'
    },{
        title:'申请结果'
    },{
        title:'产品出库'
    },{
        title:'确认全部出库后结束出库'
    }
]

const antIcon = <Icon type={"loading"} style={{fontSize:'36px'}} spin />


class StockOut extends React.Component{
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
                <Card title={"出库场景管理"} headStyle={{textAlign:"center",fontWeight:"bolder"}}>
                    <Steps current={current}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </Steps>
                    <div>
                        {current === 0 &&(
                        <div className="steps-content2">
                            <Form {...formItemLayout}>
                                <FormItem label={"请输入需要申请出库产品的RFID"}>
                                    <Input  allowClear className={"input-action"} style={{textAlign:"center"}} placeholder={"RFID"}/>
                                    <br/>
                                </FormItem>
                            </Form>
                        </div>
                    )}{current === 1 && timeout === 0&&(
                        <div className={"steps-content2"}>
                            {this.set()}
                            <Spin tip={"申请正在处理中....请耐心等待"} delay={"50"} indicator={antIcon} />
                        </div>
                    )}{current === 1 && timeout === 1&&(
                        <div className={"steps-content"}>
                            <Result status={"success"} title={"申请成功，请点击下一步按钮"}/>
                        </div>
                    )}{current === 2 &&(
                        <div className="steps-content1">
                            <Alert message={"产品出库"} description={"请将产品通过RFID扫描门运出仓库，完成后请点击下一步。"} type={"info"} style={{marginTop:"5%",width:"80%",marginLeft:"10%"}} showIcon/>
                        </div>
                    )}{current === 3 &&(
                        <div className="steps-content1">
                            <Alert message={"结束出库"} description={"请确认本次需要出库的产品全部出库后，点击结束出库按钮。"} type={"info"} style={{marginTop:"5%",width:"80%",marginLeft:"10%"}} showIcon/>
                        </div>
                    )}{current === 4 &&(
                        <div className="steps-content">
                            <div>
                                <Result status={"success"} title={"出库成功,如需继续操作请刷新页面。"}/>
                            </div>
                        </div>
                    )}
                        <div className="steps-action">
                            {current === 0 && (
                                <Button type="primary" onClick={() => this.next()}>
                                    下一步
                                </Button>
                            )}
                            {current >1  && current < 3 && (
                                <Button type="primary" onClick={() => this.next()}>
                                    下一步
                                </Button>
                            )}
                            {current === 1 && timeout === 0 && (
                                <Button type="primary disabled" >
                                    下一步
                                </Button>
                            )}
                            {current === 1 && timeout === 1 && (
                                <Button type="primary" onClick={() => this.next()}>
                                    下一步
                                </Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button type="primary" onClick={() => this.next()}>
                                    结束出库
                                </Button>
                            )}
                            {current > 0 && current< 3 && (
                                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                    上一步
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        )
    }
}

export default StockOut