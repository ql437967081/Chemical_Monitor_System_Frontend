import React from 'react'
import {Card,Button,Select,Form,Input} from 'antd'
import './producer/ui.less'
const FormItem = Form.Item;
const  Option  = Select.Option;
export default class ChangePro extends React.Component{
    render(){
        return(
            <div>
                 <Card title="修改个人信息">
                    <FilterForm/>
                </Card>
            </div>
        )
    }
}


class FilterForm extends React.Component{

    constructor(props){
        super(props);
        this.state={

        }
        this.finish=this.finish.bind(this);
    }
    finish=()=>{
        window.location.href=''
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
                <FormItem label="联系人">
                    <Input placeholder="联系人" />
                </FormItem>
                <FormItem label="联系电话">
                    <Input placeholder="联系电话" />
                </FormItem>
                <FormItem label="地址">
                    <Input placeholder="地址" />
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={this.finish}>完成</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" >修改密码（没有跳转页面）</Button>
                </FormItem>
                
            </Form>
        );
    }
}
FilterForm = Form.create({})(FilterForm);