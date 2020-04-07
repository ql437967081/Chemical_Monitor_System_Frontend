import React from 'react'
import {Card,Button,Table,Select,Form,Input} from 'antd'
import './ui.less'
const FormItem = Form.Item;
const  Option  = Select.Option;
const Search = Input.Search;
export default class SendManage extends React.Component{
    render(){
        return(
            <div>
                <Card title="发货管理"  className="send">
                    <FilterForm/>
                </Card>
            </div>
        )
    }
}

class FilterForm extends React.Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
                <FormItem label="发货公司">
                    <Input  placeholder="input search text"/>
                </FormItem>
                <FormItem label="产品名称">
                    {
                        getFieldDecorator('element_id')(
                            <Select
                                style={{width:100}}
                                placeholder="全部"
                            >
                                <Option value="1">产品1</Option>
                                <Option value="2">产品2</Option>
                                <Option value="3">产品3</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="产品数量">
                    <Input placeholder="input search text" />
                </FormItem>
                <FormItem label="目的地">
                    <Input placeholder="input search text" />
                </FormItem>
                <FormItem label="快递单号">
                    <Input placeholder="input search text" />
                </FormItem>
                <FormItem>
                    <Button type="primary">RFID写入</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary">完成</Button>
                </FormItem>
                
            </Form>
        );
    }
}
FilterForm = Form.create({})(FilterForm);