import React from "react";
import {Steps, Button, message, Card, DatePicker, Form, Input,InputNumber,Result} from "antd";
import { TimePicker } from 'antd';
import moment from "moment";
import './producer.css'

const {Step} = Steps
const FormItem = Form.Item
const {TextArea} = Input;
const steps=[
    {
        title:'时间、批次相关信息',
    },{
        title:'原料名称及用量',
    },{
        title:'成品相关信息',
    },{
        title:'系统将生成信息写入RFID',
    },{
        title:'填写并保存生成结果',
    },{
        title:'保存成功',
    }
]
class proScene extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            current:0,
        };
    }


    next(){
        const current = this.state.current + 1;
        this.setState({current});
    }

    prev(){
        const current = this.state.current - 1;
        this.setState({current});
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24},
                sm: { span: 10 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
        };
        const {current} = this.state;
        return(
            <div>
                <Card title={"生产场景"} headStyle={{textAlign:"center",fontWeight:"bolder"}}>
                    <Steps current={current}>
                        {steps.map(itme => (
                            <Step key={itme.title} title={itme.title} />
                        ))}
                    </Steps>
                    <div className={"steps-content"}>
                        {current === 0 &&(
                            <Form {...formItemLayout}>
                                <FormItem label={"请输入生产日期："}>
                                    <DatePicker defaultValue={moment()}/>
                                </FormItem>
                                <FormItem label={"请输入生产时间："}>
                                    <TimePicker defaultValue={moment()}></TimePicker>
                                </FormItem>
                                <FormItem label={"请输入产品批次："}>
                                    <Input  allowClear className={"input-action"}/>
                                </FormItem>
                            </Form>
                        )}
                        {current === 1 &&(
                            <Form {...formItemLayout}>
                                <FormItem label={"请输入原料名称："}>
                                    <Input  allowClear className={"input-action"}/>
                                </FormItem>
                                <FormItem label={"请输入用量："}>
                                    <InputNumber  allowClear className={"input-action"} min={0} placeholder={"最小为0"}/>
                                </FormItem>
                            </Form>
                        )}
                        {current === 2 &&(
                            <Form {...formItemLayout}>
                                <FormItem label={"请输入成品相关信息："}>
                                    <TextArea rows={6} placeholder={"不知道成品相关信息的类型，需要指定类型可以修改表单内组件"} allowClear={"true"}/>
                                </FormItem>
                            </Form>
                        )}{current === 3 &&(
                        <Form {...formItemLayout}>
                            <Result status={"success"} title={"系统已成功生成成品对应信息并写入RFID"} subTitle={"该步骤由系统自动完成，如成功请点击下一步"} />
                        </Form>
                    )}
                        {current === 4 &&(
                            <Form {...formItemLayout}>
                                <FormItem label={"请填写生成结果并保存："}>
                                    <TextArea rows={6} placeholder={"不知道生成结果的类型，需要指定类型可以修改表单内组件"} allowClear={"true"}/>
                                </FormItem>
                            </Form>
                        )}
                        {current === 5 &&(
                            <Form {...formItemLayout}>
                                <Result status={"success"} title={"生成结果已被保存！"} />
                            </Form>
                        )}
                    </div>
                    <div className={"steps-action"}>
                        {current < steps.length-2&&(
                            <Button type={"primary"} onClick={() => this.next()}>
                                下一步
                            </Button>
                        )}
                        {current === steps.length-2&&(
                            <Button type={"primary"} onClick={() =>this.next()}>
                                保存
                            </Button>
                        )}
                        {(current <steps.length-1)&& ( current>0 ) &&(
                            <Button style={{marginLeft:8}} onClick={() => this.prev()}>
                                上一步
                            </Button>
                        )}

                    </div>
                </Card>
            </div>
        )
    }
}

export default proScene

