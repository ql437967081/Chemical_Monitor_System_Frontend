import React from 'react'
import {Card,Button,Table,Select,Form,Input} from 'antd'
const FormItem = Form.Item;
const  Option  = Select.Option;
const Search = Input.Search;
export default class receipt extends React.Component{
    render(){
        return(
            <div>
                <Card title="收货管理"  className="receipt">
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
                <FormItem>
                    <Button type="primary">读入RFID</Button>
                </FormItem>
                <FormItem label="uid">
                    <Input  placeholder="不可修改"/>
                </FormItem>
                <FormItem label="产品名称">
                    <Input  placeholder="不可修改"/>
                </FormItem>
                <FormItem label="发货数量">
                    <Input  placeholder="不可修改"/>
                </FormItem>
                <FormItem label="发货单位">
                    <Input  placeholder="不可修改"/>
                </FormItem>
                <FormItem label="批次">
                    <Input  placeholder="不可修改"/>
                </FormItem>
                <FormItem label="到货数量">
                    <Input  placeholder="输入到货数量"/>
                </FormItem>
                <FormItem>
                    <Button type="primary">完成</Button>
                </FormItem>
                
            </Form>
        );
    }
}
FilterForm = Form.create({})(FilterForm);