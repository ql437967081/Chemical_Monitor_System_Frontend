import React from 'react'
import {Card,Button,Select,Form,Input} from 'antd'
import './ui.less'
const FormItem = Form.Item;
const  Option  = Select.Option;
export default class ChangePro extends React.Component{
    render(){
        return(
            <div>
                 <Card title="新建产品信息">
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
        this.finishAdd=this.finishAdd.bind(this);
    }
    finishAdd=()=>{
        window.location.href='/#/admin/manage'
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
                <FormItem label="生产商（固定）">
                    <Input placeholder="生产商" />
                </FormItem>
                <FormItem label="产品名称">
                    <Input placeholder="输入产品名称" />
                </FormItem>
                <FormItem label="元素">
                    {
                        getFieldDecorator('element_id')(
                            <Select
                                style={{width:100}}
                                placeholder="全部"
                            >
                                <Option value="1">钾</Option>
                                <Option value="2">Ca</Option>
                                <Option value="3">Na</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={this.finishAdd}>完成</Button>
                </FormItem>
                
            </Form>
        );
    }
}
FilterForm = Form.create({})(FilterForm);